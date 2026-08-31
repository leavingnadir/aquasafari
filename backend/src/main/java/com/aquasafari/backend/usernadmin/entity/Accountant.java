package com.aquasafari.backend.usernadmin.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ACCOUNTANT")
public class Accountant extends User {

    public Accountant() {
        super();
    }

    public Accountant(String email, String phone, String passwordHash, String firstName, String lastName) {
        super(email, phone, passwordHash, firstName, lastName);
    }

    @Override
    public Role getRole() {
        return Role.ACCOUNTANT;
    }
}
