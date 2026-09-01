package com.aquasafari.backend.usernadmin.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("ADMINISTRATOR") // Matches the SQL seed script value 'ADMINISTRATOR'
public class Administrator extends User {

    public Administrator() {
        super();
    }

    public Administrator(String email, String phone, String passwordHash, String firstName, String lastName) {
        super(email, phone, passwordHash, firstName, lastName);
    }

    @Override
    public Role getRole() {
        return Role.ADMIN;
    }
}
