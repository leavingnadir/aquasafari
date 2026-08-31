package com.aquasafari.backend.usernadmin.service;

import com.aquasafari.backend.usernadmin.dto.CustomerRequestDTO;
import com.aquasafari.backend.usernadmin.dto.CustomerResponseDTO;

import java.util.List;

public interface CustomerService {

    CustomerResponseDTO addCustomer(CustomerRequestDTO request);

    CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO request);

    void deleteCustomer(Long id);

    CustomerResponseDTO getCustomerById(Long id);

    List<CustomerResponseDTO> getAllCustomers();

    List<CustomerResponseDTO> searchCustomers(String query);
}
