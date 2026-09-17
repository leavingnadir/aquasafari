package com.aquasafari.backend.feedback.exception;

/**
 * Thrown when the review itself is fine but the customer is not allowed to leave it:
 * the trip has not been completed, it is somebody else's booking, or it has already
 * been reviewed. Mapped to 409 Conflict.
 */
public class ReviewNotAllowedException extends RuntimeException {
    public ReviewNotAllowedException(String message) {
        super(message);
    }
}
