package com.aquasafari.backend.trip;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * The shared TRIP table stores Duration as VARCHAR(50) ("3 Hours", "2 Hours").
 * Conflict detection needs a number, so this turns the text into minutes.
 */
final class DurationText {

    private static final int FALLBACK_MINUTES = 60;

    private static final Pattern HOURS = Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(?:h|hr|hrs|hour|hours)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern MINUTES = Pattern.compile("(\\d+)\\s*(?:m|min|mins|minute|minutes)\\b",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern BARE_NUMBER = Pattern.compile("^\\s*(\\d+)\\s*$");

    private DurationText() {
    }

    static int toMinutes(String text) {
        if (text == null || text.isBlank()) return FALLBACK_MINUTES;

        int total = 0;

        Matcher hours = HOURS.matcher(text);
        while (hours.find()) {
            total += Math.round(Float.parseFloat(hours.group(1)) * 60);
        }

        Matcher minutes = MINUTES.matcher(text);
        while (minutes.find()) {
            total += Integer.parseInt(minutes.group(1));
        }

        if (total == 0) {
            Matcher bare = BARE_NUMBER.matcher(text);
            if (bare.find()) {
                total = Integer.parseInt(bare.group(1));
            }
        }

        return total > 0 ? total : FALLBACK_MINUTES;
    }
}
