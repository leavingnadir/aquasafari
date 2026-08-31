package com.aquasafari.backend.boat;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * BOAT entity — Fleet Management module.
 *
 * Field origin notes (so teammates reviewing the EER diagram can follow along):
 *  - id, boatType, capacity, condition        -> straight from the EER diagram's BOAT entity
 *  - registrationCode, name, engineType,
 *    status, boatOperatorId                   -> added to satisfy the use-case scenario
 *                                                 ("Boat ID, Name, Passenger Capacity, Engine Type",
 *                                                 "assigns an active Boat Operator", "status indicators")
 *
 * boatOperatorId is stored as a plain FK column (not a JPA @ManyToOne) rather than a relation
 * into the usernadmin module's User/BoatOperator entity. That entity belongs to a teammate's
 * module and may not exist / may still be changing, so this module stays independently
 * compilable. Once usernadmin's entity is stable, this can be upgraded to a real
 * @ManyToOne(BoatOperator) relation if the team prefers.
 */
@Entity
@Table(name = "boats")
public class Boat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Business-facing identifier the admin types in on the "Add Boat" form (e.g. registration
     * number / hull code). This is what use-case extension 3a ("Duplicate Boat ID or
     * Registration") checks for uniqueness — it is deliberately separate from the internal
     * database primary key above.
     */
    @Column(name = "boat_id", nullable = false, unique = true, length = 50)
    private String boatId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "boat_type", length = 50)
    private String boatType;

    @Column(name = "passenger_capacity", nullable = false)
    private Integer passengerCapacity;

    @Column(name = "engine_type", length = 50)
    private String engineType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BoatCondition condition = BoatCondition.GOOD;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BoatStatus status = BoatStatus.AVAILABLE;

    /** FK reference to the assigned BOAT_OPERATOR's User.id (owned by the usernadmin module). */
    @Column(name = "boat_operator_id")
    private Long boatOperatorId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public Boat() {
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ----- Getters / setters -----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
