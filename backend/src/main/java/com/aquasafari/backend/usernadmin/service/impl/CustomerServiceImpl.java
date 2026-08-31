package com.aquasafari.backend.usernadmin.service.impl;

import com.aquasafari.backend.usernadmin.dto.CustomerRequestDTO;
import com.aquasafari.backend.usernadmin.dto.CustomerResponseDTO;
import com.aquasafari.backend.usernadmin.entity.Customer;
import com.aquasafari.backend.usernadmin.exception.DuplicateResourceException;
import com.aquasafari.backend.usernadmin.exception.ResourceNotFoundException;
import com.aquasafari.backend.usernadmin.repository.CustomerRepository;
import com.aquasafari.backend.usernadmin.service.CustomerService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerServiceImpl(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @Override
    @Transactional
    public CustomerResponseDTO addCustomer(CustomerRequestDTO request) {
        if (customerRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new DuplicateResourceException("A customer with this email already exists");
        }
        Customer customer = new Customer();
        applyRequestToEntity(customer, request);

        Customer saved = customerRepository.save(customer);
        return toResponse(saved);
    }

    @Override
    @Transactional
    public CustomerResponseDTO updateCustomer(Long id, CustomerRequestDTO request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        customerRepository.findByEmailIgnoreCase(request.getEmail()).ifPresent(existing -> {
            if (!existing.getUserId().equals(id)) {
                throw new DuplicateResourceException("Another customer already uses this email");
            }
        });

        applyRequestToEntity(customer, request);
        Customer updated = customerRepository.save(customer);
        return toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customerRepository.delete(customer);
    }

    @Override
    public CustomerResponseDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return toResponse(customer);
    }

    @Override
    public List<CustomerResponseDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CustomerResponseDTO> searchCustomers(String query) {
        if (query == null || query.isBlank()) {
            return getAllCustomers();
        }
        return customerRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                        query, query, query)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private void applyRequestToEntity(Customer customer, CustomerRequestDTO request) {
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
    }

    private CustomerResponseDTO toResponse(Customer customer) {
        return new CustomerResponseDTO(
                customer.getUserId(),
                customer.getFirstName(),
                customer.getLastName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getRegistrationDate(),
                customer.getCreatedAt()
        );
    }
}
