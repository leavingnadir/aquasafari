package com.aquasafari.backend.booking.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Maps to the BOOKING entity in the AquaSafari EER diagram.
 *
 * EER fields: BookingID (PK), BookingDate, PassengerCount, BookingStatus
 * EER relationships: CUSTOMER (1) --MAKES--> (N) BOOKING
 *                     TRIP (1) --BOOKS--> (N) BOOKING
 *                     BOOKING (1) --HAS PAYMENT--> (N) PAYMENT (owned by the Payment module)
 *
 * NOTE ON FOREIGN KEYS: customerId and tripId are stored as plain columns
 * (not @ManyToOne to the Customer/Trip entities) on purpose. Those entities
 * belong to teammates' modules (usernadmin, trip) that are being built in
 * parallel on the same shared branch. Storing the raw ID avoids compile-time
 * coupling to classes that may not exist yet or may still be renamed.
 * Once both entities are stable, this can be upgraded to a real
 * @ManyToOne relationship if the team agrees on it.
 */
@Entity
@Table(name = "booking")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private Long bookingId;

    @Column(name = "customer_id", nullable = false)
    private Long customerId;

    @Column(name = "trip_id", nullable = false)
    private Long tripId;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "passenger_count", nullable = false)
    private Integer passengerCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "booking_status", nullable = false, length = 20)
    private BookingStatus bookingStatus;

    /**
     * Added beyond the EER diagram to implement Extension 4a
     * ("Session timeout prior to payment: Reserved seats are released back
     * to the general pool"). Holds the moment a PENDING reservation expires
     * if payment has not been completed by then.
     */
    @Column(name = "reservation_expires_at")
    private LocalDateTime reservationExpiresAt;

    public Booking() {
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Integer getPassengerCount() {
        return passengerCount;
    }

    public void setPassengerCount(Integer passengerCount) {
        this.passengerCount = passengerCount;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getReservationExpiresAt() {
        return reservationExpiresAt;
    }

    public void setReservationExpiresAt(LocalDateTime reservationExpiresAt) {
        this.reservationExpiresAt = reservationExpiresAt;
    }
}
