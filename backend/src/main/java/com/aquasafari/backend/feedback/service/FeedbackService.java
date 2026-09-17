package com.aquasafari.backend.feedback.service;

import com.aquasafari.backend.feedback.dto.FeedbackRequest;
import com.aquasafari.backend.feedback.dto.FeedbackResponse;
import com.aquasafari.backend.feedback.dto.FeedbackUpdateRequest;
import com.aquasafari.backend.feedback.dto.RatingSummaryResponse;
import com.aquasafari.backend.feedback.dto.ReviewableTripResponse;
import com.aquasafari.backend.feedback.entity.Feedback;
import com.aquasafari.backend.feedback.exception.FeedbackNotFoundException;
import com.aquasafari.backend.feedback.exception.InappropriateContentException;
import com.aquasafari.backend.feedback.exception.ReviewNotAllowedException;
import com.aquasafari.backend.feedback.repository.BookingSnapshot;
import com.aquasafari.backend.feedback.repository.FeedbackQueryRepository;
import com.aquasafari.backend.feedback.repository.FeedbackRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Business rules for Feedback Management.
 *
 * Precondition enforced here: a review is accepted only for a booking that belongs to
 * the customer, whose trip has already sailed and finished, and whose payment is
 * verified. Extension 1a (trip not completed) is surfaced twice: the trip history marks
 * the row as not reviewable with a reason, and submit() refuses it outright, so the rule
 * holds even if someone posts straight to the API.
 */
@Service
public class FeedbackService {

    private static final Pattern LEADING_HOURS = Pattern.compile("(\\d+(?:\\.\\d+)?)");

    private final FeedbackRepository feedbackRepository;
    private final FeedbackQueryRepository queryRepository;
    private final ContentModerationService moderation;

    /** Statuses that mean the customer actually travelled. */
    private final List<String> completedStatuses;

    /** Whether the payment behind the booking must be PAID before a review is accepted. */
    private final boolean requirePaidBooking;

    public FeedbackService(FeedbackRepository feedbackRepository,
                           FeedbackQueryRepository queryRepository,
                           ContentModerationService moderation,
                           @Value("${aquasafari.feedback.completed-statuses:CONFIRMED,COMPLETED}")
                           List<String> completedStatuses,
                           @Value("${aquasafari.feedback.require-paid-booking:true}")
                           boolean requirePaidBooking) {
        this.feedbackRepository = feedbackRepository;
        this.queryRepository = queryRepository;
        this.moderation = moderation;
        this.completedStatuses = completedStatuses.stream()
                .map(status -> status.trim().toUpperCase(Locale.ROOT))
                .toList();
        this.requirePaidBooking = requirePaidBooking;
    }

    // ---------------------------------------------------------------- create

    @Transactional
    public FeedbackResponse submit(FeedbackRequest request) {
        BookingSnapshot booking = queryRepository.findBooking(request.getBookingId())
                .orElseThrow(() -> new FeedbackNotFoundException(
                        "Booking " + request.getBookingId() + " was not found"));

        if (!booking.getCustomerId().equals(request.getCustomerId())) {
            throw new ReviewNotAllowedException("This booking belongs to a different customer");
        }
        if (feedbackRepository.existsByBookingId(request.getBookingId())) {
            throw new ReviewNotAllowedException(
                    "You have already reviewed this trip. Edit your review instead.");
        }

        String blocker = reasonReviewIsBlocked(booking);
        if (blocker != null) {
            throw new ReviewNotAllowedException(blocker);
        }

        String comment = validateComment(request.getComment());

        Feedback saved = feedbackRepository.save(
                new Feedback(request.getBookingId(), request.getCustomerId(), request.getRating(), comment));

        return getById(saved.getFeedbackId());
    }

    // ------------------------------------------------------------------ read

    @Transactional(readOnly = true)
    public FeedbackResponse getById(Integer feedbackId) {
        return queryRepository.findFeedbackById(feedbackId)
                .orElseThrow(() -> new FeedbackNotFoundException("Review " + feedbackId + " was not found"));
    }

    /** Admin view: every filter optional. */
    @Transactional(readOnly = true)
    public List<FeedbackResponse> search(Integer tripId, Integer customerId, Integer minRating, String text) {
        return queryRepository.search(tripId, customerId, minRating, text);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> findByCustomer(Integer customerId) {
        return queryRepository.search(null, customerId, null, null);
    }

    @Transactional(readOnly = true)
    public List<FeedbackResponse> findByTrip(Integer tripId) {
        return queryRepository.search(tripId, null, null, null);
    }

    /** Aggregated rating published on the trip details page. */
    @Transactional(readOnly = true)
    public RatingSummaryResponse summaryForTrip(Integer tripId) {
        String route = queryRepository.findRoute(tripId)
                .orElseThrow(() -> new FeedbackNotFoundException("Trip " + tripId + " was not found"));
        return queryRepository.summaryForTrip(tripId, route);
    }

    /**
     * The customer's completed trip history with a reviewable flag on each row,
     * newest trip first.
     */
    @Transactional(readOnly = true)
    public List<ReviewableTripResponse> reviewableTrips(Integer customerId) {
        if (!queryRepository.userExists(customerId)) {
            throw new FeedbackNotFoundException("Customer " + customerId + " was not found");
        }

        List<ReviewableTripResponse> rows = new ArrayList<>();
        for (BookingSnapshot booking : queryRepository.findBookingsByCustomer(customerId)) {
            ReviewableTripResponse row = new ReviewableTripResponse();
            row.setBookingId(booking.getBookingId());
            row.setTripId(booking.getTripId());
            row.setRoute(booking.getRoute());
            row.setTripDate(booking.getTripDate());
            row.setDepartureTime(booking.getDepartureTime());
            row.setDuration(booking.getDuration());
            row.setPassengerCount(booking.getPassengerCount());
            row.setBookingStatus(booking.getBookingStatus());
            row.setPaymentStatus(booking.getPaymentStatus());

            Optional<Feedback> existing = feedbackRepository.findByBookingId(booking.getBookingId());
            existing.ifPresent(feedback -> row.setExistingFeedbackId(feedback.getFeedbackId()));

            String blocker = reasonReviewIsBlocked(booking);
            if (existing.isPresent()) {
                row.setReviewable(false);
                row.setBlockedReason("Already reviewed");
            } else if (blocker != null) {
                row.setReviewable(false);
                row.setBlockedReason(blocker);
            } else {
                row.setReviewable(true);
            }
            rows.add(row);
        }
        return rows;
    }

    // ---------------------------------------------------------------- update

    @Transactional
    public FeedbackResponse update(Integer feedbackId, FeedbackUpdateRequest request) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new FeedbackNotFoundException("Review " + feedbackId + " was not found"));

        if (!feedback.getCustomerId().equals(request.getCustomerId())) {
            throw new ReviewNotAllowedException("You can only edit your own review");
        }

        feedback.setRating(request.getRating());
        feedback.setComment(validateComment(request.getComment()));
        feedbackRepository.save(feedback);

        return getById(feedbackId);
    }

    // ---------------------------------------------------------------- delete

    /**
     * @param requestedBy the signed-in customer's id, or null when an administrator is
     *                    removing the review from the moderation screen.
     */
    @Transactional
    public void delete(Integer feedbackId, Integer requestedBy) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new FeedbackNotFoundException("Review " + feedbackId + " was not found"));

        if (requestedBy != null && !feedback.getCustomerId().equals(requestedBy)) {
            throw new ReviewNotAllowedException("You can only delete your own review");
        }
        feedbackRepository.delete(feedback);
    }

    // ----------------------------------------------------------- rule helpers

    /** @return null when the booking can be reviewed, otherwise the reason it cannot. */
    private String reasonReviewIsBlocked(BookingSnapshot booking) {
        String status = booking.getBookingStatus() == null
                ? "" : booking.getBookingStatus().trim().toUpperCase(Locale.ROOT);

        if (status.startsWith("CANCEL")) {
            return "This booking was cancelled";
        }
        if (!completedStatuses.contains(status)) {
            return "This booking is still " + status.toLowerCase(Locale.ROOT);
        }
        if (!hasFinished(booking)) {
            return "You can review this trip once it has finished";
        }
        if (requirePaidBooking && !isPaid(booking.getPaymentStatus())) {
            return "Payment for this trip has not been verified yet";
        }
        return null;
    }

    /** Trip has sailed and its duration has elapsed. */
    private boolean hasFinished(BookingSnapshot booking) {
        if (booking.getTripDate() == null) {
            return false;
        }
        LocalDateTime start = booking.getDepartureTime() == null
                ? booking.getTripDate().atStartOfDay()
                : booking.getTripDate().atTime(booking.getDepartureTime());
        return start.plusMinutes(durationMinutes(booking.getDuration())).isBefore(LocalDateTime.now());
    }

    /** Duration is free text in the TRIP table ("3 Hours", "45 min"), so parse defensively. */
    private long durationMinutes(String duration) {
        if (duration == null || duration.isBlank()) {
            return 0;
        }
        Matcher matcher = LEADING_HOURS.matcher(duration);
        if (!matcher.find()) {
            return 0;
        }
        double value = Double.parseDouble(matcher.group(1));
        String unit = duration.toLowerCase(Locale.ROOT);
        return unit.contains("min") ? (long) value : (long) (value * 60);
    }

    private boolean isPaid(String paymentStatus) {
        return paymentStatus != null && paymentStatus.trim().equalsIgnoreCase("PAID");
    }

    /** Step 4 of the main scenario, applied on both submit and update. */
    private String validateComment(String comment) {
        if (comment == null) {
            return null;
        }
        String trimmed = comment.trim();
        if (trimmed.isEmpty()) {
            return null;
        }

        List<String> flagged = moderation.findViolations(trimmed);
        if (!flagged.isEmpty()) {
            throw new InappropriateContentException(
                    "Your review contains language we can't publish. Please reword it and try again.", flagged);
        }
        if (moderation.isShouting(trimmed)) {
            throw new InappropriateContentException(
                    "Please rewrite your review without using all capitals.", List.of());
        }
        return trimmed;
    }
}
