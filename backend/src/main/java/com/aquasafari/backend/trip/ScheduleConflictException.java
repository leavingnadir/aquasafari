package com.aquasafari.backend.trip;

import java.util.List;

/** Use case step 4a: the chosen boat, operator or guide is already out on another trip. */
public class ScheduleConflictException extends RuntimeException {

    private final List<String> conflicts;

    public ScheduleConflictException(List<String> conflicts) {
        super("Selected resources are already assigned in this time slot");
        this.conflicts = conflicts;
    }

    public List<String> getConflicts() {
        return conflicts;
    }
}
