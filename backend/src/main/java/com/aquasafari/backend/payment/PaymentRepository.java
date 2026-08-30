package com.aquasafari.backend.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    List<Payment> findByBookingId(Long bookingId);

    List<Payment> findByPaymentStatus(PaymentStatus paymentStatus);

    List<Payment> findAllByOrderByPaymentDateDesc();
}
