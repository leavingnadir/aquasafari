package com.aquasafari.backend.booking.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Result row for GET /api/bookings/trips/search (Search Trips).
 * Built from a native SQL join across trip + boat (+ a per-seat rate, see
 * NOTE below) so this module does not need to depend on the Trip module's
 * JPA entity classes directly. See TripLookupService.
 */
public class TripAvailabilityDTO {

    private Long tripId;
    private String route;
    private LocalDate tripDate;
    private LocalTime departureTime;
    private String duration;
    private Integer boatCapacity;
    private Integer seatsReserved;
    private Integer seatsAvailable;
    private BigDecimal pricePerSeat;
    private BigDecimal totalCostEstimate;

    public TripAvailabilityDTO() {
    }

    public TripAvailabilityDTO(Long tripId, String route, LocalDate tripDate, LocalTime departureTime,
                                String duration, Integer boatCapacity, Integer seatsReserved,
                                BigDecimal pricePerSeat) {
        this.tripId = tripId;
        this.route = route;
        this.tripDate = tripDate;
        this.departureTime = departureTime;
        this.duration = duration;
        this.boatCapacity = boatCapacity;
        this.seatsReserved = seatsReserved;
        this.seatsAvailable = boatCapacity - seatsReserved;
        this.pricePerSeat = pricePerSeat;
    }

    public Long getTripId() {
        return tripId;
    }

    public void setTripId(Long tripId) {
        this.tripId = tripId;
    }

    public String getRoute() {
        return route;
    }

    public void setRoute(String route) {
        this.route = route;
    }

    public LocalDate getTripDate() {
        return tripDate;
    }

    public void setTripDate(LocalDate tripDate) {
        this.tripDate = tripDate;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public Integer getBoatCapacity() {
        return boatCapacity;
    }

    public void setBoatCapacity(Integer boatCapacity) {
        this.boatCapacity = boatCapacity;
    }

    public Integer getSeatsReserved() {
        return seatsReserved;
    }

    public void setSeatsReserved(Integer seatsReserved) {
        this.seatsReserved = seatsReserved;
    }

    public Integer getSeatsAvailable() {
        return seatsAvailable;
    }

    public void setSeatsAvailable(Integer seatsAvailable) {
        this.seatsAvailable = seatsAvailable;
    }

    public BigDecimal getPricePerSeat() {
        return pricePerSeat;
    }

    public void setPricePerSeat(BigDecimal pricePerSeat) {
        this.pricePerSeat = pricePerSeat;
    }

    public BigDecimal getTotalCostEstimate() {
        return totalCostEstimate;
    }

    public void setTotalCostEstimate(BigDecimal totalCostEstimate) {
        this.totalCostEstimate = totalCostEstimate;
    }
}
