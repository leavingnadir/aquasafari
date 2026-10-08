package com.aquasafari.backend.payment;
import com.aquasafari.backend.booking.dto.TripAvailabilityDTO;
import com.aquasafari.backend.booking.entity.Booking;
import com.aquasafari.backend.booking.repository.BookingRepository;
import com.aquasafari.backend.booking.service.TripLookupService;
import com.aquasafari.backend.payment.dto.PaymentResponse;
import com.aquasafari.backend.payment.dto.ProcessPaymentRequest;
import com.aquasafari.backend.payment.dto.UpdatePaymentRequest;
import com.aquasafari.backend.payment.exception.PaymentDeclinedException;
import com.aquasafari.backend.payment.exception.PaymentNotFoundException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PaymentService — the BUSINESS layer of the Payment module.
 *
 * RESPONSIBILITY (single responsibility):
 *   • Own all payment business rules
 *   • Custom card validation (number, holder, expiry)
 *   • Business validation (booking exists, amount == pricePerSeat × passengerCount)
 *   • Gateway simulation and confirmation code generation
 *   • Persist PAID / DECLINED / UPDATED / DELETED payments via the repository
 *   • NEVER know about HTTP, JSON, ResponseEntity, or @PathVariable
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
@Service
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final TripLookupService tripLookupService;
    private final Random random = new Random();

    public PaymentService(PaymentRepository paymentRepository, BookingRepository bookingRepository,
                          TripLookupService tripLookupService) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.tripLookupService = tripLookupService;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CREATE — Process a new payment
    // Called by: PaymentController.processPayment() → POST /api/payments/process
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE OF THIS METHOD (business layer):
    //   1. Run custom card validation (only when method == CREDIT_CARD)
    //   2. Look up the Booking; throw 404 if missing
    //   3. Compute booking total = pricePerSeat × passengerCount
    //   4. Verify client-sent amount exactly matches computed total → 400 if not
    //   5. Build Payment entity (initial status PENDING, set by constructor)
    //   6. Simulate gateway call (or call real gateway in production)
    //   7. On approval → status PAID, generate TXN code, save
    //   8. On decline  → status DECLINED, set reason, save, then throw
    //                    PaymentDeclinedException so the controller can
    //                    respond with HTTP 402
    //
    // ═════════════════════════════════════════════════════════════════════════
    @Transactional
    public PaymentResponse processPayment(ProcessPaymentRequest request) {
        validatePaymentDetails(request);

        Booking booking = bookingRepository.findById(request.getBookingId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                "Booking not found: " + request.getBookingId()));

        TripAvailabilityDTO trip = tripLookupService.getTripAvailability(booking.getTripId());
        BigDecimal bookingTotal = trip.getPricePerSeat()
            .multiply(BigDecimal.valueOf(booking.getPassengerCount()));

        if (request.getAmount().compareTo(bookingTotal) != 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Payment amount does not match the booking total: " + bookingTotal);
        }

        Payment payment = new Payment(request.getBookingId(), bookingTotal, request.getPaymentMethod());
        boolean gatewayApproved = simulateGatewayCall(request);
        if (gatewayApproved) {
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setTransactionReference(generateConfirmationCode());
            Payment saved = paymentRepository.save(payment);
            return PaymentResponse.fromEntity(saved);
        }
        else {
            payment.setPaymentStatus(PaymentStatus.DECLINED);
            payment.setDeclineReason("Insufficient funds or bank declined the transaction");
            Payment saved = paymentRepository.save(payment);
            throw new PaymentDeclinedException(saved.getPaymentId(), saved.getDeclineReason());
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CUSTOM CARD VALIDATION (helper for processPayment)
    // ═════════════════════════════════════════════════════════════════════════

    private void validatePaymentDetails(ProcessPaymentRequest request) {
        // Skip all card rules for non-card methods.
        if (request.getPaymentMethod() != PaymentMethod.CREDIT_CARD) {
            return;
        }

        // Card number — strip spaces, require exactly 16 digits.
        // (Real production code would use Luhn + 13-19 digit ranges;
        //  this demo intentionally keeps it strict.)
        String cardNumber = request.getCardNumber() == null
            ? ""
            : request.getCardNumber().replace(" ", "");
        if (!cardNumber.matches("\\d{16}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Card number must contain exactly 16 digits and no other characters.");
        }

        // Card holder name — at least 3 Unicode letters, allows spaces and
        // punctuation common in names (e.g., "O'Brien", "De Silva-Fernando").
        String cardHolderName = request.getCardHolderName() == null
            ? ""
            : request.getCardHolderName().trim();
        if (!cardHolderName.matches("[\\p{L} .'-]{3,}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Card holder's name must contain at least 3 letters and cannot contain numbers.");
        }

        // Expiry — must be MM/YY and in the future.
        String expiry = request.getExpiryDate() == null ? "" : request.getExpiryDate();
        if (!expiry.matches("(0[1-9]|1[0-2])/\\d{2}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiry must be in MM/YY format.");
        }
        try {
            // "20" prefix makes "25" → 2025. YearMonth.parse needs "YYYY-MM".
            YearMonth expiryMonth = YearMonth.parse("20" + expiry.substring(3) + "-" + expiry.substring(0, 2));
            if (expiryMonth.isBefore(YearMonth.now())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Card has expired.");
            }
        } catch (DateTimeParseException ex) {
            // Defensive — regex already filtered most invalid inputs.
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Expiry must be in MM/YY format.");
        }
    }

    private boolean simulateGatewayCall(ProcessPaymentRequest request) {
        // Card payments in this demo accept any valid 16-digit number.
        return request.getPaymentMethod() == PaymentMethod.CREDIT_CARD || random.nextInt(10) < 9;
    }

    private String generateConfirmationCode() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // ═════════════════════════════════════════════════════════════════════════
    // READ #1 — Payment history (newest first)
    // Called by: PaymentController.getPaymentHistory() → GET /api/payments/history
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE:
    //   • Query all payments, already sorted descending by the repository's
    //     derived method findAllByOrderByPaymentDateDesc().
    //   • Map each entity → PaymentResponse DTO.
    //   • Return an immutable stream-collected List.
    //
    // ═════════════════════════════════════════════════════════════════════════
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentHistory() {
        return paymentRepository.findAllByOrderByPaymentDateDesc()
                .stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ═════════════════════════════════════════════════════════════════════════
    // READ #2 — All payments belonging to one booking
    // Called by: PaymentController.getPaymentsByBooking() → GET /api/payments/booking/{id}
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE:
    //   • Delegates filtering to the repository derived query findByBookingId.
    //   • Returns empty list if the booking has no payments — that's a valid
    //     state, not an error, so we deliberately DON'T throw 404 here.
    //   • Same entity → DTO mapping as READ #1.
    // ═════════════════════════════════════════════════════════════════════════
    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // ═════════════════════════════════════════════════════════════════════════
    // READ #3 — Single payment by id (used to render the receipt)
    // Called by: PaymentController.getPaymentById() → GET /api/payments/{id}
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE:
    //   • Look up by id; if missing → PaymentNotFoundException.
    //   • The controller-local @ExceptionHandler turns that into HTTP 404.
    //   • On success, returns a fully-populated PaymentResponse (receipt).
    // ═════════════════════════════════════════════════════════════════════════
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
        return PaymentResponse.fromEntity(payment);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // UPDATE — Partial correction of an existing payment record
    // Called by: PaymentController.updatePayment() → PUT /api/payments/{id}
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE OF THIS METHOD:
    //   1. Load the entity; if missing → PaymentNotFoundException → 404
    //   2. Apply ONLY the non-null fields from UpdatePaymentRequest
    //      (this is what makes it a PARTIAL update, not a full overwrite)
    //   3. Save and return the updated DTO
    //
    // ═════════════════════════════════════════════════════════════════════════
    @Transactional
    public PaymentResponse updatePayment(Long paymentId, UpdatePaymentRequest request) {

        // Step 1 — load, or 404.
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));

        // Step 2 — apply only what the caller actually supplied.
        if (request.getAmount() != null) {
            payment.setAmount(request.getAmount());
        }
        if (request.getPaymentMethod() != null) {
            payment.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getPaymentStatus() != null) {
            payment.setPaymentStatus(request.getPaymentStatus());
        }

        // Step 3 — persist and map to DTO.
        Payment saved = paymentRepository.save(payment);
        return PaymentResponse.fromEntity(saved);
    }

    // ═════════════════════════════════════════════════════════════════════════
    // DELETE — Remove a payment record
    // Called by: PaymentController.deletePaymentRecord() → DELETE /api/payments/{id}
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE:
    //   1. Check the record exists first.
    //      If not → PaymentNotFoundException → controller returns 404.
    //   2. Delete by id.
    //
    // ═════════════════════════════════════════════════════════════════════════
    @Transactional
    public void deletePaymentRecord(Long paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new PaymentNotFoundException(paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }
}
