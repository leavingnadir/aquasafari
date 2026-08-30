package com.aquasafari.backend.payment.dto;

import com.aquasafari.backend.payment.PaymentMethod;
import com.aquasafari.backend.payment.PaymentStatus;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;

/**
 * Payload for correcting/updating an existing payment record - e.g. an
 * Accountant fixing a wrong amount, changing the recorded method, or
 * manually marking a payment as REFUNDED. Fields are all optional: only the
 * ones supplied are changed (partial update).
 */
public class UpdatePaymentRequest {

    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}
