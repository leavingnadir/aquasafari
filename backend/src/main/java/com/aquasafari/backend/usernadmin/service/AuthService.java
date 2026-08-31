package com.aquasafari.backend.usernadmin.service;

import com.aquasafari.backend.usernadmin.dto.AuthResponseDTO;
import com.aquasafari.backend.usernadmin.dto.LoginRequestDTO;
import com.aquasafari.backend.usernadmin.dto.RegisterRequestDTO;

public interface AuthService {
    AuthResponseDTO register(RegisterRequestDTO request);
    AuthResponseDTO login(LoginRequestDTO request);
}
