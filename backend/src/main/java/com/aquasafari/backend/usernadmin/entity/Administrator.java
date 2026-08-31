package com.aquasafari.backend.usernadmin.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

/**
 * Administrator subtype of USER (EER: ADMINISTRATOR).
 * No extra columns in the current EER diagram - kept as its own
 * subclass so it participates correctly in the "role" discriminator.
 */
@Entity
@DiscriminatorValue("ADMINISTRATOR")
public class Administrator extends User {

    public Administrator() {
        super();
    }
}
