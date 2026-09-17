package com.aquasafari.backend.feedback.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Scoped to this module's package on purpose. A project-wide @RestControllerAdvice would
 * swallow teammates' exceptions too, and six people adding one each would fight over
 * which handler wins.
 */
@RestControllerAdvice(basePackages = "com.aquasafari.backend.feedback")
public class FeedbackExceptionHandler {

    @ExceptionHandler(FeedbackNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(FeedbackNotFoundException ex) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(ReviewNotAllowedException.class)
    public ResponseEntity<Map<String, Object>> handleNotAllowed(ReviewNotAllowedException ex) {
        return build(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(InappropriateContentException.class)
    public ResponseEntity<Map<String, Object>> handleContent(InappropriateContentException ex) {
        ResponseEntity<Map<String, Object>> response = build(HttpStatus.UNPROCESSABLE_ENTITY, ex.getMessage());
        response.getBody().put("flaggedWords", ex.getFlagged());
        return response;
    }

    /** Turns bean-validation failures into a field -> message map the form can render. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            fieldErrors.put(error.getField(), error.getDefaultMessage());
        }
        ResponseEntity<Map<String, Object>> response =
                build(HttpStatus.BAD_REQUEST, "Check the highlighted fields and try again");
        response.getBody().put("fieldErrors", fieldErrors);
        return response;
    }

    private ResponseEntity<Map<String, Object>> build(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}
