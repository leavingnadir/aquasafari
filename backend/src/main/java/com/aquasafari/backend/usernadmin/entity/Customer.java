package com.aquasafari.backend.usernadmin.entity;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;

import java.time.LocalDate;

@Entity
@DiscriminatorValue("CUSTOMER")
public class Customer extends User {

    @Column(name = "RegistrationDate")
    private LocalDate registrationDate;

    public Customer() {
        super();
    }

    public Customer(String email, String phone, String passwordHash, String firstName, String lastName) {
        super(email, phone, passwordHash, firstName, lastName);
        this.registrationDate = LocalDate.now();
    }

    @Override
    public Role getRole() {
        return Role.CUSTOMER;
    }

    public LocalDate getRegistrationDate() {
        return registrationDate;
    }

    public void setRegistrationDate(LocalDate registrationDate) {
        this.registrationDate = registrationDate;
    }
}
