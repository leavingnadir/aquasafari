package com.aquasafari.backend.feedback.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Main scenario step 4: validate review text before it is saved.
 *
 * Two checks run: a blocked-word match and a shouting/spam check. The word list is
 * deliberately mild and lives in application.properties
 * (aquasafari.feedback.blocked-words), so the demo can be run in front of a marker
 * without anything crude sitting in the source tree.
 */
@Service
public class ContentModerationService {

    /** Common character swaps used to slip past a plain word match (h4te -> hate). */
    private static final String[][] LEET = {
            {"0", "o"}, {"1", "i"}, {"3", "e"}, {"4", "a"}, {"5", "s"}, {"7", "t"}, {"@", "a"}, {"$", "s"}
    };

    private final List<String> blockedWords;

    public ContentModerationService(
            @Value("${aquasafari.feedback.blocked-words:damn,idiot,stupid,scam,fraud,rubbish,hate}")
            List<String> blockedWords) {
        this.blockedWords = blockedWords.stream()
                .map(word -> word.trim().toLowerCase(Locale.ROOT))
                .filter(word -> !word.isEmpty())
                .toList();
    }

    /** @return the offending words, or an empty list when the comment is clean. */
    public List<String> findViolations(String comment) {
        List<String> flagged = new ArrayList<>();
        if (comment == null || comment.isBlank()) {
            return flagged;
        }

        String normalised = normalise(comment);
        for (String word : blockedWords) {
            Pattern pattern = Pattern.compile("\\b" + Pattern.quote(word) + "\\b");
            Matcher matcher = pattern.matcher(normalised);
            if (matcher.find()) {
                flagged.add(word);
            }
        }
        return flagged;
    }

    /** True when the text is mostly capitals, which reads as shouting rather than a review. */
    public boolean isShouting(String comment) {
        if (comment == null) {
            return false;
        }
        long letters = comment.chars().filter(Character::isLetter).count();
        if (letters < 20) {
            return false;
        }
        long capitals = comment.chars().filter(Character::isUpperCase).count();
        return (double) capitals / letters > 0.7;
    }

    private String normalise(String comment) {
        String text = comment.toLowerCase(Locale.ROOT);
        for (String[] swap : LEET) {
            text = text.replace(swap[0], swap[1]);
        }
        // collapse repeated letters so "stuuuupid" is still caught
        return text.replaceAll("(.)\\1{2,}", "$1");
    }
}
