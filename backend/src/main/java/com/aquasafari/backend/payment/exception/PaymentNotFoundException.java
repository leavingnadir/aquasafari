package com.aquasafari.backend.payment.exception;

public class PaymentNotFoundException extends RuntimeException {
    public PaymentNotFoundException(Long paymentId) {
        super("Payment record not found with ID: " + paymentId);
    }
}
