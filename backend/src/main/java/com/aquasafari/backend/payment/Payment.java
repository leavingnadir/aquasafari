package com.aquasafari.backend.payment;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Payment entity - maps to the PAYMENT table in the EER diagram.
 *
 * Note on BookingID: Booking belongs to the Booking Management module (owned by
 * a different teammate). To avoid a hard JPA relationship across module
 * boundaries (and merge conflicts on a shared Entity), we store bookingId as a
 * plain Long foreign key column rather than a @ManyToOne to a Booking entity.
 * hibernate.ddl-auto=update will create the FK column; if the team later
 * agrees on a shared Booking entity package, this can be swapped for a real
 * @ManyToOne.
 */
@Entity
@Table(name = "PAYMENT")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PaymentID")
    private Long paymentId;

    @Column(name = "BookingID", nullable = false)
    private Long bookingId;

    @Column(name = "PaymentDate", nullable = false)
    private LocalDateTime paymentDate;

    @Column(name = "Amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "PaymentMethod", nullable = false, length = 30)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "PaymentStatus", nullable = false, length = 20)
    private PaymentStatus paymentStatus;

    // Confirmation code returned by the payment gateway (step 4 of main scenario)
    @Column(name = "TransactionReference", length = 100)
    private String transactionReference;

    // Populated on extension 3a (transaction declined)
    @Column(name = "DeclineReason", length = 255)
    private String declineReason;

    public Payment() {
    }

    public Payment(Long bookingId, BigDecimal amount, PaymentMethod paymentMethod) {
        this.bookingId = bookingId;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = PaymentStatus.PENDING;
        this.paymentDate = LocalDateTime.now();
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }

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

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public String getDeclineReason() {
        return declineReason;
    }

    public void setDeclineReason(String declineReason) {
        this.declineReason = declineReason;
    }
}
