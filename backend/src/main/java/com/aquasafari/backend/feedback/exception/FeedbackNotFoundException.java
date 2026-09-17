package com.aquasafari.backend.feedback.exception;

/** Thrown when a review id (or the booking behind it) does not exist. Mapped to 404. */
public class FeedbackNotFoundException extends RuntimeException {
    public FeedbackNotFoundException(String message) {
        super(message);
    }
}
