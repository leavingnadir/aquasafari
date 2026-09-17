package com.aquasafari.backend.feedback.dto;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Aggregated rating published on the trip details page (main scenario step 6).
 * distribution maps star value -> number of reviews, always 5 down to 1.
 */
public class RatingSummaryResponse {

    private Integer tripId;
    private String route;
    private long totalReviews;
    private double averageRating;
    private Map<Integer, Long> distribution = new LinkedHashMap<>();

    public static RatingSummaryResponse empty(Integer tripId, String route) {
        RatingSummaryResponse summary = new RatingSummaryResponse();
        summary.tripId = tripId;
        summary.route = route;
        summary.totalReviews = 0;
        summary.averageRating = 0d;
        for (int star = 5; star >= 1; star--) {
            summary.distribution.put(star, 0L);
        }
        return summary;
    }

    public Integer getTripId() { return tripId; }
    public void setTripId(Integer tripId) { this.tripId = tripId; }

    public String getRoute() { return route; }
    public void setRoute(String route) { this.route = route; }

    public long getTotalReviews() { return totalReviews; }
    public void setTotalReviews(long totalReviews) { this.totalReviews = totalReviews; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public Map<Integer, Long> getDistribution() { return distribution; }
    public void setDistribution(Map<Integer, Long> distribution) { this.distribution = distribution; }
}
