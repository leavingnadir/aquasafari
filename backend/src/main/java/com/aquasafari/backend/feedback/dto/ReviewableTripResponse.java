package com.aquasafari.backend.feedback.dto;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * One row of the customer's completed trip history (main scenario step 1).
 * reviewable = false carries the reason in blockedReason so the UI can grey the
 * button out and explain why instead of failing on submit (extension 1a).
 */
public class ReviewableTripResponse {

    private Integer bookingId;
    private Integer tripId;
    private String route;
    private LocalDate tripDate;
    private LocalTime departureTime;
    private String duration;
    private Integer passengerCount;
    private String bookingStatus;
    private String paymentStatus;
    private boolean reviewable;
    private String blockedReason;
    private Integer existingFeedbackId;

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

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

    public Integer getPassengerCount() { return passengerCount; }
    public void setPassengerCount(Integer passengerCount) { this.passengerCount = passengerCount; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public boolean isReviewable() { return reviewable; }
    public void setReviewable(boolean reviewable) { this.reviewable = reviewable; }

    public String getBlockedReason() { return blockedReason; }
    public void setBlockedReason(String blockedReason) { this.blockedReason = blockedReason; }

    public Integer getExistingFeedbackId() { return existingFeedbackId; }
    public void setExistingFeedbackId(Integer existingFeedbackId) { this.existingFeedbackId = existingFeedbackId; }
}
