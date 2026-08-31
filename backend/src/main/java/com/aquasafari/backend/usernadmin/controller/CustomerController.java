package com.aquasafari.backend.usernadmin.controller;

import com.aquasafari.backend.usernadmin.dto.CustomerRequestDTO;
import com.aquasafari.backend.usernadmin.dto.CustomerResponseDTO;
import com.aquasafari.backend.usernadmin.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Admin & User Management module - Customer CRUD.
 * Base path: /api/admin/customers
 * Precondition (per use case): caller is an authenticated Administrator.
 * Auth/session enforcement is expected to be added by the auth/security module.
 */
@RestController
@RequestMapping("/api/admin/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // GET /api/admin/customers - list all customers
    @GetMapping
    public ResponseEntity<List<CustomerResponseDTO>> getAllCustomers() {
        return ResponseEntity.ok(customerService.getAllCustomers());
    }

    // GET /api/admin/customers/search?query=... - search by name or email
    @GetMapping("/search")
    public ResponseEntity<List<CustomerResponseDTO>> searchCustomers(
            @RequestParam(required = false) String query) {
        return ResponseEntity.ok(customerService.searchCustomers(query));
    }

    // GET /api/admin/customers/{id}
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(customerService.getCustomerById(id));
    }

    // POST /api/admin/customers - add customer
    @PostMapping
    public ResponseEntity<CustomerResponseDTO> addCustomer(
            @Valid @RequestBody CustomerRequestDTO request) {
        CustomerResponseDTO created = customerService.addCustomer(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // PUT /api/admin/customers/{id} - update customer information
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponseDTO> updateCustomer(
            @PathVariable Long id, @Valid @RequestBody CustomerRequestDTO request) {
        return ResponseEntity.ok(customerService.updateCustomer(id, request));
    }

    // DELETE /api/admin/customers/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}
