package com.aquasafari.backend.boat;

import java.time.LocalDateTime;

/** Shape of the JSON returned to the frontend for a single boat. */
public class BoatResponseDTO {

    private Long id;
    private String boatId;
    private String name;
    private String boatType;
    private Integer passengerCapacity;
    private String engineType;
    private BoatCondition condition;
    private BoatStatus status;
    private Long boatOperatorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BoatResponseDTO fromEntity(Boat boat) {
        BoatResponseDTO dto = new BoatResponseDTO();
        dto.id = boat.getId();
        dto.boatId = boat.getBoatId();
        dto.name = boat.getName();
        dto.boatType = boat.getBoatType();
        dto.passengerCapacity = boat.getPassengerCapacity();
        dto.engineType = boat.getEngineType();
        dto.condition = boat.getCondition();
        dto.status = boat.getStatus();
        dto.boatOperatorId = boat.getBoatOperatorId();
        dto.createdAt = boat.getCreatedAt();
        dto.updatedAt = boat.getUpdatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getBoatId() {
        return boatId;
    }

    public String getName() {
        return name;
    }

    public String getBoatType() {
        return boatType;
    }

    public Integer getPassengerCapacity() {
        return passengerCapacity;
    }

    public String getEngineType() {
        return engineType;
    }

    public BoatCondition getCondition() {
        return condition;
    }

    public BoatStatus getStatus() {
        return status;
    }

    public Long getBoatOperatorId() {
        return boatOperatorId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
