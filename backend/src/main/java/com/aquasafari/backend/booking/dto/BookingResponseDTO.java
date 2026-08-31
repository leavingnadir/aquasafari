package com.aquasafari.backend.booking.dto;

import com.aquasafari.backend.booking.entity.Booking;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Response shape for booking endpoints (View Bookings, Book Trip, Cancel Booking).
 */
public class BookingResponseDTO {

    private Long bookingId;
    private Long customerId;
    private Long tripId;
    private LocalDate bookingDate;
    private Integer passengerCount;
    private String bookingStatus;
    private LocalDateTime reservationExpiresAt;

    public static BookingResponseDTO fromEntity(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.bookingId = booking.getBookingId();
        dto.customerId = booking.getCustomerId();
        dto.tripId = booking.getTripId();
        dto.bookingDate = booking.getBookingDate();
        dto.passengerCount = booking.getPassengerCount();
        dto.bookingStatus = booking.getBookingStatus().name();
        dto.reservationExpiresAt = booking.getReservationExpiresAt();
        return dto;
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

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getReservationExpiresAt() {
        return reservationExpiresAt;
    }

    public void setReservationExpiresAt(LocalDateTime reservationExpiresAt) {
        this.reservationExpiresAt = reservationExpiresAt;
    }
}
