package com.aquasafari.backend.trip;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Trip Management module - AquaSafari (Group 2026-Y2-S1-MLB-B03G2-03)
 *
 * Mapped onto the shared [TRIP] table created in the group's SQL script:
 *
 *   TripID INT IDENTITY PK, BoatID INT NOT NULL FK -> BOAT,
 *   OperatorID INT NOT NULL FK -> [USER], GuideID INT NOT NULL FK -> [USER],
 *   TripDate DATE, DepartureTime TIME, Duration VARCHAR(50),
 *   Route VARCHAR(150), Price DECIMAL(10,2)
 *
 * BOAT and [USER] belong to other modules, so the three keys are held as plain
 * Integer columns. That keeps this module compiling on its own and stops two
 * people mapping the same join twice.
 *
 * No new columns are declared here on purpose: with ddl-auto=update, any extra
 * field would silently ALTER the shared table for all six members.
 */
@Entity
@Table(name = "TRIP")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TripID")
    private Integer tripId;

    @NotNull(message = "Select a boat")
    @Column(name = "BoatID", nullable = false)
    private Integer boatId;

    @NotNull(message = "Select a boat operator")
    @Column(name = "OperatorID", nullable = false)
    private Integer operatorId;

    @NotNull(message = "Select a tour guide")
    @Column(name = "GuideID", nullable = false)
    private Integer guideId;

    @NotNull(message = "Trip date is required")
    @Column(name = "TripDate", nullable = false)
    private LocalDate tripDate;

    @NotNull(message = "Departure time is required")
    @Column(name = "DepartureTime", nullable = false)
    private LocalTime departureTime;

    /** Free text in the shared schema, e.g. "3 Hours", "90 Minutes", "2h 30m". */
    @NotBlank(message = "Duration is required")
    @Column(name = "Duration", nullable = false, length = 50)
    private String duration;

    @NotBlank(message = "Route is required")
    @Column(name = "Route", nullable = false, length = 150)
    private String route;

    @NotNull(message = "Price per seat is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(name = "Price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    /* ------------------- helpers for conflict detection ------------------- */

    /**
     * Reads the free-text Duration column as minutes so overlapping slots can be
     * compared. Understands "3 Hours", "90 Minutes", "2h 30m", "1.5 hours", "45".
     * Falls back to 60 minutes when the text cannot be parsed.
     */
    @Transient
    public int durationMinutes() {
        return DurationText.toMinutes(duration);
    }

    @Transient
    public int startMinute() {
        return departureTime.getHour() * 60 + departureTime.getMinute();
    }

    @Transient
    public int endMinute() {
        return startMinute() + durationMinutes();
    }

    /* ------------------------------ accessors ------------------------------ */

    public Integer getTripId() { return tripId; }
    public void setTripId(Integer tripId) { this.tripId = tripId; }

    public Integer getBoatId() { return boatId; }
    public void setBoatId(Integer boatId) { this.boatId = boatId; }

    public Integer getOperatorId() { return operatorId; }
    public void setOperatorId(Integer operatorId) { this.operatorId = operatorId; }

    public Integer getGuideId() { return guideId; }
    public void setGuideId(Integer guideId) { this.guideId = guideId; }

    public LocalDate getTripDate() { return tripDate; }
    public void setTripDate(LocalDate tripDate) { this.tripDate = tripDate; }

    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }

    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
