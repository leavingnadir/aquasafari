package com.aquasafari.backend.boat;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Fleet Management endpoints — Boat Management module.
 *
 * Base path: /api/boats
 *   GET    /api/boats            -> view all boats (with status indicators)
 *   GET    /api/boats/available  -> "View Available Boats" use case
 *   GET    /api/boats/{id}       -> single boat
 *   POST   /api/boats            -> "Add Boat"
 *   PUT    /api/boats/{id}       -> "Edit Boat Details"
 *   DELETE /api/boats/{id}       -> "Delete Boat"
 */
@RestController
@RequestMapping("/api/boats")
public class BoatController {

    private final BoatService boatService;

    public BoatController(BoatService boatService) {
        this.boatService = boatService;
    }

    @GetMapping
    public ResponseEntity<List<BoatResponseDTO>> getAllBoats() {
        return ResponseEntity.ok(boatService.getAllBoats());
    }

    @GetMapping("/available")
    public ResponseEntity<List<BoatResponseDTO>> getAvailableBoats() {
        return ResponseEntity.ok(boatService.getAvailableBoats());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BoatResponseDTO> getBoatById(@PathVariable Long id) {
        return ResponseEntity.ok(boatService.getBoatById(id));
    }

    @PostMapping
    public ResponseEntity<BoatResponseDTO> createBoat(@Valid @RequestBody BoatRequestDTO request) {
        BoatResponseDTO created = boatService.createBoat(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BoatResponseDTO> updateBoat(@PathVariable Long id,
                                                        @Valid @RequestBody BoatRequestDTO request) {
        return ResponseEntity.ok(boatService.updateBoat(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoat(@PathVariable Long id) {
        boatService.deleteBoat(id);
        return ResponseEntity.noContent().build();
    }

    // ----- Local exception handling (scoped to this controller only, so it can't clash
    //       with @RestControllerAdvice classes teammates add for their own modules) -----

    @ExceptionHandler(BoatNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleNotFound(BoatNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(DuplicateBoatIdException.class)
    public ResponseEntity<Map<String, String>> handleDuplicate(DuplicateBoatIdException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }
}
