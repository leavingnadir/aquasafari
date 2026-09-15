package com.aquasafari.backend.trip;

import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    /** Admin table: every trip in the schedule. */
    @GetMapping
    public List<Trip> getAll() {
        return tripService.findAll();
    }

    /** Customer listing and the Booking module: today's date onward. */
    @GetMapping("/available")
    public List<Trip> getAvailable(
            @RequestParam(required = false) String route,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return tripService.findAvailable(route, date);
    }

    @GetMapping("/{id}")
    public Trip getOne(@PathVariable Integer id) {
        return tripService.findById(id);
    }

    /** Used by the Boat module to show a boat's upcoming schedule. */
    @GetMapping("/by-boat/{boatId}")
    public List<Trip> getByBoat(@PathVariable Integer boatId) {
        return tripService.findByBoat(boatId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Trip create(@Valid @RequestBody Trip trip) {
        return tripService.create(trip);
    }

    @PutMapping("/{id}")
    public Trip update(@PathVariable Integer id, @Valid @RequestBody Trip trip) {
        return tripService.update(id, trip);
    }

    /** Body: { "boatId": 1, "operatorId": 2, "guideId": 3 } */
    @PutMapping("/{id}/assign")
    public Trip assign(@PathVariable Integer id, @RequestBody Map<String, Integer> body) {
        return tripService.assignResources(id, body.get("boatId"), body.get("operatorId"), body.get("guideId"));
    }

    /** Pre-check behind the form's "Check availability" button. */
    @PostMapping("/check-conflicts")
    public ResponseEntity<Map<String, Object>> checkConflicts(
            @RequestBody Trip candidate,
            @RequestParam(required = false) Integer ignoreTripId) {
        List<String> conflicts = tripService.detectConflicts(candidate, ignoreTripId);
        return ResponseEntity.ok(Map.of("available", conflicts.isEmpty(), "conflicts", conflicts));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        tripService.delete(id);
    }
}
