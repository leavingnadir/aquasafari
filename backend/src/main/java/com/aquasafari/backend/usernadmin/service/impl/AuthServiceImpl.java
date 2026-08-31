package com.aquasafari.backend.usernadmin.service.impl;

import com.aquasafari.backend.usernadmin.dto.AuthResponseDTO;
import com.aquasafari.backend.usernadmin.dto.LoginRequestDTO;
import com.aquasafari.backend.usernadmin.dto.RegisterRequestDTO;
import com.aquasafari.backend.usernadmin.entity.Customer;
import com.aquasafari.backend.usernadmin.entity.User;
import com.aquasafari.backend.usernadmin.exception.DuplicateResourceException;
import com.aquasafari.backend.usernadmin.exception.InvalidCredentialsException;
import com.aquasafari.backend.usernadmin.repository.UserRepository;
import com.aquasafari.backend.usernadmin.security.JwtUtil;
import com.aquasafari.backend.usernadmin.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account already exists for: " + request.getEmail());
        }

        // Public self-signup always creates a CUSTOMER - staff accounts are
        // created by an Administrator through /api/admin/staff instead.
        Customer customer = new Customer(
                request.getEmail(),
                request.getPhone(),
                passwordEncoder.encode(request.getPassword()),
                request.getFirstName(),
                request.getLastName()
        );

        User saved = userRepository.save(customer);
        String token = jwtUtil.generateToken(saved);

        return new AuthResponseDTO(
                token, saved.getUserId(), saved.getUsername(),
                saved.getFirstName(), saved.getLastName(), saved.getRole()
        );
    }

    @Override
    public AuthResponseDTO login(LoginRequestDTO request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException();
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(InvalidCredentialsException::new);

        String token = jwtUtil.generateToken(user);

        return new AuthResponseDTO(
                token, user.getUserId(), user.getUsername(),
                user.getFirstName(), user.getLastName(), user.getRole()
        );
    }
}
