package com.aquasafari.backend.booking.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Maps to the BOOKING entity in the AquaSafari EER diagram.
 *
 * EER fields: BookingID (PK), BookingDate, PassengerCount, BookingStatus
 * EER relationships: CUSTOMER (1) --MAKES--> (N) BOOKING
 *                   TRIP (1) --BOOKS--> (N) BOOKING
 *                   BOOKING (1) --HAS PAYMENT--> (N) PAYMENT (owned by the Payment module)
 */
@Entity
@Table(name = "BOOKING") // Matches uppercase table name in SQL Server
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingID") // Matches uppercase column name
    private Long bookingId;

    @Column(name = "CustomerID", nullable = false) // Matches uppercase column name
    private Long customerId;

    @Column(name = "TripID", nullable = false) // Matches uppercase column name
    private Long tripId;

    @Column(name = "BookingDate", nullable = false) // Matches uppercase column name
    private LocalDate bookingDate;

    @Column(name = "PassengerCount", nullable = false) // Matches uppercase column name
    private Integer passengerCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "BookingStatus", nullable = false, length = 30) // Matches uppercase column name
    private BookingStatus bookingStatus;

    /**
     * Added beyond the EER diagram to implement Extension 4a
     * ("Session timeout prior to payment: Reserved seats are released back
     * to the general pool"). Holds the moment a PENDING reservation expires
     * if payment has not been completed by then.
     */
    @Column(name = "ReservationExpiresAt")
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
