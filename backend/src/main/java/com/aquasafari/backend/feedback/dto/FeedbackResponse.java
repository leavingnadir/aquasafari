package com.aquasafari.backend.feedback.dto;

import java.time.LocalDate;

/**
 * A review as the UI needs it: the row from FEEDBACK plus the customer name and
 * trip details joined in, so neither the customer list nor the admin table has to
 * make extra calls into teammates' modules.
 */
public class FeedbackResponse {

    private Integer feedbackId;
    private Integer bookingId;
    private Integer customerId;
    private String customerName;
    private Integer tripId;
    private String route;
    private LocalDate tripDate;
    private Integer rating;
    private String comment;

    public Integer getFeedbackId() { return feedbackId; }
    public void setFeedbackId(Integer feedbackId) { this.feedbackId = feedbackId; }

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public Integer getTripId() { return tripId; }
    public void setTripId(Integer tripId) { this.tripId = tripId; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public LocalDate getTripDate() { return tripDate; }
    public void setTripDate(LocalDate tripDate) { this.tripDate = tripDate; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
