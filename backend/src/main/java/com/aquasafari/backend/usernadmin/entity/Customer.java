package com.aquasafari.backend.usernadmin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;

import java.time.LocalDate;

/**
 * Customer subtype of USER (EER: CUSTOMER, adds RegistrationDate).
 * This is the entity managed by the Admin & User Management module's
 * CRUD operations (Add/Update/Delete/Search Customer).
 */
@Entity
@DiscriminatorValue("CUSTOMER")
public class Customer extends User {

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    public Customer() {
        super();
    }

    @PrePersist
    private void onCustomerCreate() {
        if (this.registrationDate == null) {
            this.registrationDate = LocalDate.now();
        }
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }
}
