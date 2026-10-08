package com.aquasafari.backend.payment;

// ─────────────────────────────────────────────────────────────────────────────
// DTO IMPORTS
// PaymentResponse       → what we send back to the frontend (also doubles as receipt)
// ProcessPaymentRequest → input DTO for CREATE (POST /process)
// UpdatePaymentRequest  → input DTO for UPDATE (PUT /{id}) — partial update
// ─────────────────────────────────────────────────────────────────────────────
import com.aquasafari.backend.payment.dto.PaymentResponse;
import com.aquasafari.backend.payment.dto.ProcessPaymentRequest;
import com.aquasafari.backend.payment.dto.UpdatePaymentRequest;

// ─────────────────────────────────────────────────────────────────────────────
// DOMAIN EXCEPTIONS
// PaymentDeclinedException → thrown by service when gateway rejects → mapped to 402
// PaymentNotFoundException → thrown by service when id not found     → mapped to 404
// ─────────────────────────────────────────────────────────────────────────────
import com.aquasafari.backend.payment.exception.PaymentDeclinedException;
import com.aquasafari.backend.payment.exception.PaymentNotFoundException;

// ─────────────────────────────────────────────────────────────────────────────
// Jakarta Bean Validation — @Valid triggers DTO annotations (@NotNull, @DecimalMin, @Digits)
// Spring Web — @RestController, @RequestMapping, @PostMapping, @RequestBody, etc.
// java.util.List / Map — response wrappers
// ─────────────────────────────────────────────────────────────────────────────
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PaymentController — the HTTP layer of the Payment module.
 *
 * RESPONSIBILITY (single responsibility):
 *   • Receive HTTP requests from the React frontend
 *   • Trigger bean validation via @Valid
 *   • Delegate business work to PaymentService
 *   • Translate service exceptions into proper HTTP status codes + JSON
 *   • NEVER touch the database, NEVER contain business rules
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    // Injected dependency — the Controller never creates its own service.
    // Constructor injection is preferred over @Autowired field injection
    // because it makes the dependency explicit and the class immutable.
    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // ═════════════════════════════════════════════════════════════════════════
    // CREATE — Process a new payment
    // Endpoint: POST /api/payments/process
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE OF THIS METHOD (HTTP layer only):
    //   1. Accept JSON body → deserialize into ProcessPaymentRequest
    //   2. @Valid triggers bean validation on the DTO
    //      (@NotNull bookingId, @NotNull @DecimalMin @Digits amount, @NotNull paymentMethod)
    //   3. Delegate to service → service does custom card validation + business rules
    //   4. On success → HTTP 201 Created with PaymentResponse body
    //   5. On PaymentDeclinedException → HTTP 402 with { paymentId, status, reason }
    //
    // ═════════════════════════════════════════════════════════════════════════
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@Valid @RequestBody ProcessPaymentRequest request) {
        try {
            // Delegate — service runs validatePaymentDetails(), booking lookup,
            // amount comparison, gateway simulation, DB save, txn ref generation.
            PaymentResponse response = paymentService.processPayment(request);

            // 201 Created — semantically correct for a newly created payment record.
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (PaymentDeclinedException ex) {
            // Extension 3a from the use case scenario:
            // Decline is NOT a server error — it is a valid business outcome.
            // Return 402 Payment Required with a minimal JSON payload so the
            // React UI can render "Payment declined: <reason>" and offer retry.
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                    "paymentId", ex.getPaymentId(),   // id of the persisted DECLINED row
                    "status",    "DECLINED",          // explicit status string for the UI
                    "reason",    ex.getMessage()      // human-readable decline reason
            ));
        }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // READ #1 — Payment history (all payments, newest first)
    // Endpoint: GET /api/payments/history
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE:
    //   • Pure read — no validation, no body, no path variables
    //   • Delegates to service → repository → findAllByOrderByPaymentDateDesc()
    //   • Wraps the list in ResponseEntity.ok() → HTTP 200
    //
    // WHY CONTROLLER + SERVICE?
    //   Controller knows "this is a GET returning JSON".
    //   Service knows "query the DB sorted descending and map entities → DTOs".
    // ═════════════════════════════════════════════════════════════════════════
    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory() {
        return ResponseEntity.ok(paymentService.getPaymentHistory());
    }

    // ═════════════════════════════════════════════════════════════════════════
    // READ #2 — All payments belonging to a specific booking
    // Endpoint: GET /api/payments/booking/{bookingId}
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE:
    //   • @PathVariable extracts bookingId from the URL
    //   • No @Valid — path variables are validated implicitly by type (Long)
    //   • Returns empty list if the booking has no payments (no 404 here —
    //     "no payments" is a valid state, not an error)
    // ═════════════════════════════════════════════════════════════════════════
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBooking(bookingId));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // READ #3 — Single payment by id (used to render the receipt)
    // Endpoint: GET /api/payments/{id}
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE:
    //   • Delegates to service → service throws PaymentNotFoundException if missing
    //   • The exception bubbles to @ExceptionHandler at the bottom → HTTP 404
    //   • On success → HTTP 200 with PaymentResponse
    // ═════════════════════════════════════════════════════════════════════════
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // UPDATE — Partial correction of an existing payment record
    // Endpoint: PUT /api/payments/{id}
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE OF THIS METHOD:
    //   1. @PathVariable Long id           → which payment to update
    //   2. @Valid @RequestBody UpdatePaymentRequest → optional fields
    //      (only the fields present in the JSON will be updated — partial update)
    //   3. Delegate to service → service loads the entity, applies only non-null
    //      fields, saves, returns updated DTO
    //   4. If payment id doesn't exist → PaymentNotFoundException → 404 via handler
    // ═════════════════════════════════════════════════════════════════════════
    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long id, @Valid @RequestBody UpdatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }

    // ═════════════════════════════════════════════════════════════════════════
    // DELETE — Remove a payment record
    // Endpoint: DELETE /api/payments/{id}
    // ═════════════════════════════════════════════════════════════════════════
    //
    // ROLE:
    //   1. @PathVariable Long id → which payment to delete
    //   2. Delegate to service → service checks existsById() first
    //      If missing → PaymentNotFoundException → 404 via handler
    //   3. On success → HTTP 204 No Content (no body — nothing to return)
    //
    // ═════════════════════════════════════════════════════════════════════════
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePaymentRecord(@PathVariable Long id) {
        paymentService.deletePaymentRecord(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(PaymentNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(PaymentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", ex.getMessage()));
    }
}