package com.aquasafari.backend.feedback.controller;

import com.aquasafari.backend.feedback.dto.FeedbackRequest;
import com.aquasafari.backend.feedback.dto.FeedbackResponse;
import com.aquasafari.backend.feedback.dto.FeedbackUpdateRequest;
import com.aquasafari.backend.feedback.dto.RatingSummaryResponse;
import com.aquasafari.backend.feedback.dto.ReviewableTripResponse;
import com.aquasafari.backend.feedback.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Feedback Management endpoints.
 *
 * POST   /api/feedback                          submit a review
 * PUT    /api/feedback/{id}                     edit your own review
 * DELETE /api/feedback/{id}[?customerId=]       remove a review (admin, or owner with customerId)
 * GET    /api/feedback/{id}                     one review
 * GET    /api/feedback                          all reviews, filters optional (admin screen)
 * GET    /api/feedback/customer/{customerId}    one customer's reviews
 * GET    /api/feedback/trip/{tripId}            reviews shown on a trip page
 * GET    /api/feedback/trip/{tripId}/summary    aggregated rating for a trip
 * GET    /api/feedback/reviewable/{customerId}  completed trip history with a reviewable flag
 *
 * CORS is handled centrally in com.aquasafari.backend.config.CorsConfig, so there is no
 * @CrossOrigin here for the group to keep in sync across six controllers.
 */
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping
    public ResponseEntity<FeedbackResponse> submit(@Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.submit(request));
    }

    @PutMapping("/{feedbackId}")
    public ResponseEntity<FeedbackResponse> update(@PathVariable Integer feedbackId,
                                                   @Valid @RequestBody FeedbackUpdateRequest request) {
        return ResponseEntity.ok(feedbackService.update(feedbackId, request));
    }

    @DeleteMapping("/{feedbackId}")
    public ResponseEntity<Void> delete(@PathVariable Integer feedbackId,
                                       @RequestParam(required = false) Integer customerId) {
        feedbackService.delete(feedbackId, customerId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<FeedbackResponse> getOne(@PathVariable Integer feedbackId) {
        return ResponseEntity.ok(feedbackService.getById(feedbackId));
    }

    @GetMapping
    public ResponseEntity<List<FeedbackResponse>> search(@RequestParam(required = false) Integer tripId,
                                                         @RequestParam(required = false) Integer customerId,
                                                         @RequestParam(required = false) Integer minRating,
                                                         @RequestParam(required = false) String search) {
        return ResponseEntity.ok(feedbackService.search(tripId, customerId, minRating, search));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<FeedbackResponse>> byCustomer(@PathVariable Integer customerId) {
        return ResponseEntity.ok(feedbackService.findByCustomer(customerId));
    }

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<FeedbackResponse>> byTrip(@PathVariable Integer tripId) {
        return ResponseEntity.ok(feedbackService.findByTrip(tripId));
    }

    @GetMapping("/trip/{tripId}/summary")
    public ResponseEntity<RatingSummaryResponse> tripSummary(@PathVariable Integer tripId) {
        return ResponseEntity.ok(feedbackService.summaryForTrip(tripId));
    }

    @GetMapping("/reviewable/{customerId}")
    public ResponseEntity<List<ReviewableTripResponse>> reviewableTrips(@PathVariable Integer customerId) {
        return ResponseEntity.ok(feedbackService.reviewableTrips(customerId));
    }
}
