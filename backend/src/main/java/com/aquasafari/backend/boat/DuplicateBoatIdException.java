package com.aquasafari.backend.boat;

/** Thrown for use-case extension 3a: "Duplicate Boat ID or Registration". */
public class DuplicateBoatIdException extends RuntimeException {
    public DuplicateBoatIdException(String boatId) {
        super("A boat with Boat ID '" + boatId + "' already exists. Please enter a unique identifier.");
    }
}
