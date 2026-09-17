package com.aquasafari.backend.feedback.exception;

import java.util.List;

/** Thrown when the comment fails the content check in step 4. Mapped to 422. */
public class InappropriateContentException extends RuntimeException {

    private final List<String> flagged;

    public InappropriateContentException(String message, List<String> flagged) {
        super(message);
        this.flagged = flagged;
    }

    public List<String> getFlagged() {
        return flagged;
    }
}
