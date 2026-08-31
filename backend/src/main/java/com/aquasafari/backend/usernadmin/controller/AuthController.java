package com.aquasafari.backend.usernadmin.controller;

import com.aquasafari.backend.usernadmin.dto.AuthResponseDTO;
import com.aquasafari.backend.usernadmin.dto.LoginRequestDTO;
import com.aquasafari.backend.usernadmin.dto.RegisterRequestDTO;
import com.aquasafari.backend.usernadmin.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Public customer self-signup
    @PostMapping("/register")
    public ResponseEntity<AuthResponseDTO> register(@Valid @RequestBody RegisterRequestDTO request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    // Used by every role - Customer, Admin, Accountant, Tour Guide, Boat Operator
    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
