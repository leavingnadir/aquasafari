package com.aquasafari.backend.usernadmin.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

@Entity
@DiscriminatorValue("TOUR_GUIDE")
public class TourGuide extends User {

    public TourGuide() {
        super();
    }

    public TourGuide(String email, String phone, String passwordHash, String firstName, String lastName) {
        super(email, phone, passwordHash, firstName, lastName);
    }

    @Override
    public Role getRole() {
        return Role.TOUR_GUIDE;
    }
}
