package com.aquasafari.backend.payment.exception;

/**
 * Thrown when the (simulated) Payment Gateway declines a transaction -
 * corresponds to extension 3a in the use case scenario.
 */
public class PaymentDeclinedException extends RuntimeException {

    private final Long paymentId;

    public PaymentDeclinedException(Long paymentId, String reason) {
        super(reason);
        this.paymentId = paymentId;
    }

    public Long getPaymentId() {
        return paymentId;
    }
}
