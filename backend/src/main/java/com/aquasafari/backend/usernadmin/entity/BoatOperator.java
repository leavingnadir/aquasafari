package com.aquasafari.backend.usernadmin.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("BOAT_OPERATOR")
public class BoatOperator extends User {

    public BoatOperator() {
        super();
    }

    public BoatOperator(String email, String phone, String passwordHash, String firstName, String lastName) {
        super(email, phone, passwordHash, firstName, lastName);
    }

    @Override
    public Role getRole() {
        return Role.BOAT_OPERATOR;
    }
}
