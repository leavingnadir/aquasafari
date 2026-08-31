package com.aquasafari.backend.boat;

public class BoatNotFoundException extends RuntimeException {
    public BoatNotFoundException(Long id) {
        super("Boat not found with id: " + id);
    }

    public BoatNotFoundException(String message) {
        super(message);
    }
}
