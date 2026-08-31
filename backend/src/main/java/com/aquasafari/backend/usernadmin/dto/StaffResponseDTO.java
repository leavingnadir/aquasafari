package com.aquasafari.backend.usernadmin.dto;

import com.aquasafari.backend.usernadmin.entity.Role;
import com.aquasafari.backend.usernadmin.entity.User;

import java.time.LocalDateTime;

public class StaffResponseDTO {

    private Long userId;
    private String email;
    private String phone;
    private String firstName;
    private String lastName;
    private Role role;
    private LocalDateTime createdAt;
    private boolean active;

    public static StaffResponseDTO fromEntity(User user) {
        StaffResponseDTO dto = new StaffResponseDTO();
        dto.userId = user.getUserId();
        dto.email = user.getUsername(); // email is the username field
        dto.phone = user.getPhone();
        dto.firstName = user.getFirstName();
        dto.lastName = user.getLastName();
        dto.role = user.getRole();
        dto.createdAt = user.getCreatedAt();
        dto.active = user.isEnabled();
        return dto;
    }

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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
