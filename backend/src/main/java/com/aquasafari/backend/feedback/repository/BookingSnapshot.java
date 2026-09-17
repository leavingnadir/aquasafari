package com.aquasafari.backend.feedback.repository;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Read-only view of a BOOKING joined to its TRIP and latest PAYMENT.
 * This module never writes to those tables; it only needs them to decide whether a
 * trip really is completed and paid for before a review is accepted.
 */
public class BookingSnapshot {

    private Integer bookingId;
    private Integer customerId;
    private String bookingStatus;
    private Integer passengerCount;
    private Integer tripId;
    private String route;
    private LocalDate tripDate;
    private LocalTime departureTime;
    private String duration;
    private String paymentStatus;

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public Integer getPassengerCount() { return passengerCount; }
    public void setPassengerCount(Integer passengerCount) { this.passengerCount = passengerCount; }

    public Integer getTripId() { return tripId; }
    public void setTripId(Integer tripId) { this.tripId = tripId; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public LocalDate getTripDate() { return tripDate; }
    public void setTripDate(LocalDate tripDate) { this.tripDate = tripDate; }

    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
