package com.aquasafari.backend.booking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/**
 * Request body for POST /api/bookings (Book Trip).
 */
public class BookingRequestDTO {

    @NotNull(message = "customerId is required")
    private Long customerId;

    @NotNull(message = "tripId is required")
    private Long tripId;

    @NotNull(message = "passengerCount is required")
    @Min(value = 1, message = "passengerCount must be at least 1")
    private Integer passengerCount;

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

    public Integer getPassengerCount() {
        return passengerCount;
    }

    public void setPassengerCount(Integer passengerCount) {
        this.passengerCount = passengerCount;
    }
}
