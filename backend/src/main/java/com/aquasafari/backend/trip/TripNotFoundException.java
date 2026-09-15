package com.aquasafari.backend.trip;

public class TripNotFoundException extends RuntimeException {
    public TripNotFoundException(Integer id) {
        super("No trip found with id " + id);
    }
}
