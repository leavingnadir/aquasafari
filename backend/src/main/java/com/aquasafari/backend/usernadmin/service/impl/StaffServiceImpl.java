package com.aquasafari.backend.usernadmin.service.impl;

import com.aquasafari.backend.usernadmin.dto.StaffRequestDTO;
import com.aquasafari.backend.usernadmin.dto.StaffResponseDTO;
import com.aquasafari.backend.usernadmin.entity.*;
import com.aquasafari.backend.usernadmin.exception.DuplicateResourceException;
import com.aquasafari.backend.usernadmin.exception.ResourceNotFoundException;
import com.aquasafari.backend.usernadmin.repository.UserRepository;
import com.aquasafari.backend.usernadmin.service.StaffService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StaffServiceImpl implements StaffService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<StaffResponseDTO> getAllStaff() {
        return userRepository.findAllStaff().stream()
                .map(StaffResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public StaffResponseDTO getStaffById(Long userId) {
        User user = findStaffOrThrow(userId);
        return StaffResponseDTO.fromEntity(user);
    }

    @Override
    @Transactional
    public StaffResponseDTO createStaff(StaffRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account already exists for: " + request.getEmail());
        }
        if (request.getRole() == Role.CUSTOMER) {
            throw new IllegalArgumentException("Use the public registration endpoint for customer accounts");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required when creating a staff account");
        }

        String hash = passwordEncoder.encode(request.getPassword());
        User newStaff = buildEntityForRole(request.getRole(), request, hash);

        User saved = userRepository.save(newStaff);
        return StaffResponseDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public StaffResponseDTO updateStaff(Long userId, StaffRequestDTO request) {
        User existing = findStaffOrThrow(userId);

        // Changing role after creation would mean swapping the JPA discriminator,
        // which single-table inheritance doesn't support in place - keep it simple
        // and require deleting + recreating the account for a role change.
        if (request.getRole() != existing.getRole()) {
            throw new IllegalArgumentException(
                    "Changing a staff member's role isn't supported - delete and recreate the account instead");
        }

        existing.setEmail(request.getEmail());
        existing.setPhone(request.getPhone());
        existing.setFirstName(request.getFirstName());
        existing.setLastName(request.getLastName());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            existing.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        User saved = userRepository.save(existing);
        return StaffResponseDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteStaff(Long userId) {
        User user = findStaffOrThrow(userId);
        userRepository.delete(user);
    }

    private User findStaffOrThrow(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff account not found: " + userId));
        if (user.getRole() == Role.CUSTOMER) {
            throw new ResourceNotFoundException("Staff account not found: " + userId);
        }
        return user;
    }

    private User buildEntityForRole(Role role, StaffRequestDTO r, String passwordHash) {
        return switch (role) {
            case ADMIN -> new Administrator(r.getEmail(), r.getPhone(), passwordHash, r.getFirstName(), r.getLastName());
            case BOAT_OPERATOR -> new BoatOperator(r.getEmail(), r.getPhone(), passwordHash, r.getFirstName(), r.getLastName());
            case TOUR_GUIDE -> new TourGuide(r.getEmail(), r.getPhone(), passwordHash, r.getFirstName(), r.getLastName());
            case ACCOUNTANT -> new Accountant(r.getEmail(), r.getPhone(), passwordHash, r.getFirstName(), r.getLastName());
            case CUSTOMER -> throw new IllegalArgumentException("Use the public registration endpoint for customer accounts");
        };
    }
}
