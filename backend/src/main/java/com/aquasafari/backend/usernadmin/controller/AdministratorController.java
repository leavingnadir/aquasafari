package com.aquasafari.backend.usernadmin.controller;

import com.aquasafari.backend.usernadmin.dto.StaffRequestDTO;
import com.aquasafari.backend.usernadmin.dto.StaffResponseDTO;
import com.aquasafari.backend.usernadmin.service.StaffService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin-only CRUD over the four non-customer roles (Administrator,
 * BoatOperator, TourGuide, Accountant). Locked down to ROLE_ADMIN in
 * SecurityConfig - reachable only with a valid Administrator JWT.
 */
@RestController
@RequestMapping("/api/admin/staff")
public class AdministratorController {

    private final StaffService staffService;

    public AdministratorController(StaffService staffService) {
        this.staffService = staffService;
    }

    @GetMapping
    public ResponseEntity<List<StaffResponseDTO>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponseDTO> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.getStaffById(id));
    }

    @PostMapping
    public ResponseEntity<StaffResponseDTO> createStaff(@Valid @RequestBody StaffRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(staffService.createStaff(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponseDTO> updateStaff(
            @PathVariable Long id, @Valid @RequestBody StaffRequestDTO request) {
        return ResponseEntity.ok(staffService.updateStaff(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffService.deleteStaff(id);
        return ResponseEntity.noContent().build();
    }
}
