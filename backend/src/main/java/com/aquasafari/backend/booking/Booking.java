package com.aquasafari.backend.booking.entity;

/**
 * Lifecycle states for a Booking.
 *
 * PENDING     - seats reserved temporarily, waiting for payment (UC main flow step 4)
 * CONFIRMED   - payment completed via UC-05 Payment Management (step 5-6)
 * CANCELLED   - cancelled by the customer
 * EXPIRED     - session timed out before payment; seats released back to pool (Extension 4a)
 */
public enum BookingStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    EXPIRED
}
