package com.aquasafari.backend.payment;

import com.aquasafari.backend.payment.dto.PaymentResponse;
import com.aquasafari.backend.payment.dto.ProcessPaymentRequest;
import com.aquasafari.backend.payment.dto.UpdatePaymentRequest;
import com.aquasafari.backend.payment.exception.PaymentDeclinedException;
import com.aquasafari.backend.payment.exception.PaymentNotFoundException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    // Create/Process payment -> POST /api/payments/process
    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@Valid @RequestBody ProcessPaymentRequest request) {
        try {
            PaymentResponse response = paymentService.processPayment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (PaymentDeclinedException ex) {
            // Extension 3a: decline reason returned so the UI can prompt for
            // an alternative payment method.
            return ResponseEntity.status(HttpStatus.PAYMENT_REQUIRED).body(Map.of(
                    "paymentId", ex.getPaymentId(),
                    "status", "DECLINED",
                    "reason", ex.getMessage()
            ));
        }
    }

    // Record transaction / list history -> GET /api/payments/history
    @GetMapping("/history")
    public ResponseEntity<List<PaymentResponse>> getPaymentHistory() {
        return ResponseEntity.ok(paymentService.getPaymentHistory());
    }

    // GET /api/payments/booking/{bookingId}
    @GetMapping("/booking/{bookingId}")
    public ResponseEntity<List<PaymentResponse>> getPaymentsByBooking(@PathVariable Long bookingId) {
        return ResponseEntity.ok(paymentService.getPaymentsByBooking(bookingId));
    }

    // GET /api/payments/{id}  (used to render the receipt)
    @GetMapping("/{id}")
    public ResponseEntity<PaymentResponse> getPaymentById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    // Update/correct a payment record -> PUT /api/payments/{id}
    @PutMapping("/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(
            @PathVariable Long id, @Valid @RequestBody UpdatePaymentRequest request) {
        return ResponseEntity.ok(paymentService.updatePayment(id, request));
    }

    // Delete payment record -> DELETE /api/payments/{id}
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
