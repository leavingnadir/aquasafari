package com.aquasafari.backend.payment;

import com.aquasafari.backend.payment.dto.PaymentResponse;
import com.aquasafari.backend.payment.dto.ProcessPaymentRequest;
import com.aquasafari.backend.payment.dto.UpdatePaymentRequest;
import com.aquasafari.backend.payment.exception.PaymentDeclinedException;
import com.aquasafari.backend.payment.exception.PaymentNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final Random random = new Random();

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    /**
     * Main scenario steps 1-6: sends the customer's details to the (simulated)
     * payment gateway, then records the transaction and either marks the
     * payment PAID with a confirmation code, or - on extension 3a - throws a
     * PaymentDeclinedException after logging the DECLINED attempt so the
     * frontend can prompt for an alternative payment method.
     */
    @Transactional
    public PaymentResponse processPayment(ProcessPaymentRequest request) {
        Payment payment = new Payment(request.getBookingId(), request.getAmount(), request.getPaymentMethod());

        boolean gatewayApproved = simulateGatewayCall(request);

        if (gatewayApproved) {
            payment.setPaymentStatus(PaymentStatus.PAID);
            payment.setTransactionReference(generateConfirmationCode());
            Payment saved = paymentRepository.save(payment);
            // NOTE: In the full system this is also where the Booking Management
            // module would be notified to update BookingStatus -> "Paid".
            return PaymentResponse.fromEntity(saved);
        } else {
            payment.setPaymentStatus(PaymentStatus.DECLINED);
            payment.setDeclineReason("Insufficient funds or bank declined the transaction");
            Payment saved = paymentRepository.save(payment);
            throw new PaymentDeclinedException(saved.getPaymentId(), saved.getDeclineReason());
        }
    }

    /** Placeholder for the real Payment Gateway integration (Stripe/PayHere/etc). */
    private boolean simulateGatewayCall(ProcessPaymentRequest request) {
        // 90% approval rate simulation
        return random.nextInt(10) < 9;
    }

    private String generateConfirmationCode() {
        return "TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentHistory() {
        return paymentRepository.findAllByOrderByPaymentDateDesc()
                .stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<PaymentResponse> getPaymentsByBooking(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .stream()
                .map(PaymentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));
        return PaymentResponse.fromEntity(payment);
    }

    /**
     * Update (correct) an existing payment record - e.g. Accountant fixes a
     * wrong amount/method, or manually marks a payment REFUNDED. Only the
     * fields present in the request are changed.
     */
    @Transactional
    public PaymentResponse updatePayment(Long paymentId, UpdatePaymentRequest request) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));

        if (request.getAmount() != null) {
            payment.setAmount(request.getAmount());
        }
        if (request.getPaymentMethod() != null) {
            payment.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getPaymentStatus() != null) {
            payment.setPaymentStatus(request.getPaymentStatus());
        }

        Payment saved = paymentRepository.save(payment);
        return PaymentResponse.fromEntity(saved);
    }

    @Transactional
    public void deletePaymentRecord(Long paymentId) {
        if (!paymentRepository.existsById(paymentId)) {
            throw new PaymentNotFoundException(paymentId);
        }
        paymentRepository.deleteById(paymentId);
    }
}
