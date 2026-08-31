package com.aquasafari.backend.usernadmin.entity;

import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Base entity for every AquaSafari account. Maps the EER "USER" superclass +
 * its ISA relationship to ADMINISTRATOR / BOAT_OPERATOR / TOUR_GUIDE /
 * ACCOUNTANT / CUSTOMER using JPA single-table inheritance: one physical
 * USER table, one "user_type" discriminator column, subtype-specific columns
 * added as nullable extras (Customer.registrationDate is the only one the
 * EER diagram calls out).
 *
 * Implements Spring Security's UserDetails directly so the JWT filter and
 * auth manager can use this entity as-is, without a separate adapter class.
 */
@Entity
@Table(name = "USER")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "user_type", discriminatorType = DiscriminatorType.STRING)
public abstract class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userId;

    @Column(name = "Email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "Phone", length = 20)
    private String phone;

    @Column(name = "PasswordHash", nullable = false)
    private String passwordHash;

    @Column(name = "FirstName", nullable = false, length = 80)
    private String firstName;

    @Column(name = "LastName", nullable = false, length = 80)
    private String lastName;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "IsActive", nullable = false)
    private boolean active = true;

    protected User() {
    }

    protected User(String email, String phone, String passwordHash, String firstName, String lastName) {
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.firstName = firstName;
        this.lastName = lastName;
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    /** Every subclass reports which Role it is, used for JWT claims and access checks. */
    public abstract Role getRole();

    // ---- Spring Security UserDetails contract ----

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + getRole().name()));
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    // ---- plain getters/setters ----

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
