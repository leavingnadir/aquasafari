package com.aquasafari.backend.boat;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** Shape of the JSON body for POST /api/boats and PUT /api/boats/{id}. */
public class BoatRequestDTO {

    @NotBlank(message = "Boat ID is required")
    private String boatId;

    @NotBlank(message = "Boat name is required")
    private String name;

    private String boatType;

    @NotNull(message = "Passenger capacity is required")
    @Min(value = 1, message = "Passenger capacity must be at least 1")
    private Integer passengerCapacity;

    private String engineType;

    private BoatCondition condition;

    private BoatStatus status;

    /** Optional — the use case allows the admin to leave a boat unassigned initially. */
    private Long boatOperatorId;

    public String getBoatId() {
        return boatId;
    }

    public void setBoatId(String boatId) {
        this.boatId = boatId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBoatType() {
        return boatType;
    }

    public void setBoatType(String boatType) {
        this.boatType = boatType;
    }

    public Integer getPassengerCapacity() {
        return passengerCapacity;
    }

    public void setPassengerCapacity(Integer passengerCapacity) {
        this.passengerCapacity = passengerCapacity;
    }

    public String getEngineType() {
        return engineType;
    }

    public void setEngineType(String engineType) {
        this.engineType = engineType;
    }

    public BoatCondition getCondition() {
        return condition;
    }

    public void setCondition(BoatCondition condition) {
        this.condition = condition;
    }

    public BoatStatus getStatus() {
        return status;
    }

    public void setStatus(BoatStatus status) {
        this.status = status;
    }

    public Long getBoatOperatorId() {
        return boatOperatorId;
    }

    public void setBoatOperatorId(Long boatOperatorId) {
        this.boatOperatorId = boatOperatorId;
    }
}
