package com.aquasafari.backend.trip;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Scoped with assignableTypes so it only covers TripController and will not
 * interfere with handlers written by the other five modules.
 */
@RestControllerAdvice(assignableTypes = TripController.class)
public class TripExceptionHandler {

    @ExceptionHandler(TripNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(TripNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), List.of());
    }

    @ExceptionHandler(ScheduleConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ScheduleConflictException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), ex.getConflicts());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalState(IllegalStateException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage(), List.of());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), List.of());
    }

    /** Boat or user id that does not exist, or a booking still pointing at the trip. */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Map<String, Object>> handleFk(DataIntegrityViolationException ex) {
        return build(HttpStatus.CONFLICT,
                "The boat, operator or guide number does not exist, or bookings still reference this trip.",
                List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        List<String> details = new ArrayList<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(err -> details.add(err.getField() + ": " + err.getDefaultMessage()));
        return build(HttpStatus.BAD_REQUEST, "Some trip details need fixing", details);
    }

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message, List<String> details) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("message", message);
        body.put("conflicts", details);
        return ResponseEntity.status(status).body(body);
    }
}
