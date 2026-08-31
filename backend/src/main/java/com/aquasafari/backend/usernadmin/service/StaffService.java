package com.aquasafari.backend.usernadmin.service;

import com.aquasafari.backend.usernadmin.dto.StaffRequestDTO;
import com.aquasafari.backend.usernadmin.dto.StaffResponseDTO;

import java.util.List;

public interface StaffService {
    List<StaffResponseDTO> getAllStaff();
    StaffResponseDTO getStaffById(Long userId);
    StaffResponseDTO createStaff(StaffRequestDTO request);
    StaffResponseDTO updateStaff(Long userId, StaffRequestDTO request);
    void deleteStaff(Long userId);
}
