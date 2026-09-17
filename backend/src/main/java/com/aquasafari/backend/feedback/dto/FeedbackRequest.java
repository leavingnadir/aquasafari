package com.aquasafari.backend.feedback.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Payload for submitting a review (POST /api/feedback). */
public class FeedbackRequest {

    @NotNull(message = "Select the trip you want to review")
    private Integer bookingId;

    @NotNull(message = "Customer is required")
    private Integer customerId;

    @NotNull(message = "Give the trip a rating")
    @Min(value = 1, message = "Rating must be between 1 and 5 stars")
    @Max(value = 5, message = "Rating must be between 1 and 5 stars")
    private Integer rating;

    @Size(max = 500, message = "Keep your review under 500 characters")
    private String comment;

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
