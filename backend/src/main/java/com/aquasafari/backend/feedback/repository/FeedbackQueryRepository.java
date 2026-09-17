package com.aquasafari.backend.feedback.repository;

import com.aquasafari.backend.feedback.dto.FeedbackResponse;
import com.aquasafari.backend.feedback.dto.RatingSummaryResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Time;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * All cross-module reads for Feedback Management, kept in plain SQL against the tables
 * created by the group's seed-data.sql. Nothing here writes, so it cannot collide with
 * the Booking, Trip, Payment or User modules; it also means this module builds and runs
 * before their entity classes are pushed to the shared branch.
 */
@Repository
public class FeedbackQueryRepository {

    private static final String FEEDBACK_SELECT = """
            SELECT f.FeedbackID, f.BookingID, f.CustomerID, f.Rating, f.Comment,
                   u.FirstName, u.LastName,
                   b.TripID, t.Route, t.TripDate
            FROM FEEDBACK f
            JOIN BOOKING b ON b.BookingID = f.BookingID
            JOIN TRIP    t ON t.TripID    = b.TripID
            JOIN [USER]  u ON u.UserID    = f.CustomerID
            """;

    private static final String BOOKING_SELECT = """
            SELECT b.BookingID, b.CustomerID, b.BookingStatus, b.PassengerCount,
                   t.TripID, t.Route, t.TripDate, t.DepartureTime, t.Duration,
                   (SELECT TOP 1 p.PaymentStatus
                      FROM PAYMENT p
                     WHERE p.BookingID = b.BookingID
                     ORDER BY p.PaymentID DESC) AS PaymentStatus
            FROM BOOKING b
            JOIN TRIP t ON t.TripID = b.TripID
            """;

    private final JdbcTemplate jdbc;

    public FeedbackQueryRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private static final RowMapper<FeedbackResponse> FEEDBACK_MAPPER = (ResultSet rs, int rowNum) -> {
        FeedbackResponse dto = new FeedbackResponse();
        dto.setFeedbackId(rs.getInt("FeedbackID"));
        dto.setBookingId(rs.getInt("BookingID"));
        dto.setCustomerId(rs.getInt("CustomerID"));
        dto.setCustomerName(fullName(rs.getString("FirstName"), rs.getString("LastName")));
        dto.setTripId(rs.getInt("TripID"));
        dto.setRoute(rs.getString("Route"));
        dto.setTripDate(toLocalDate(rs.getDate("TripDate")));
        dto.setRating(rs.getInt("Rating"));
        dto.setComment(rs.getString("Comment"));
        return dto;
    };

    private static final RowMapper<BookingSnapshot> BOOKING_MAPPER = (ResultSet rs, int rowNum) -> {
        BookingSnapshot snapshot = new BookingSnapshot();
        snapshot.setBookingId(rs.getInt("BookingID"));
        snapshot.setCustomerId(rs.getInt("CustomerID"));
        snapshot.setBookingStatus(rs.getString("BookingStatus"));
        snapshot.setPassengerCount(rs.getInt("PassengerCount"));
        snapshot.setTripId(rs.getInt("TripID"));
        snapshot.setRoute(rs.getString("Route"));
        snapshot.setTripDate(toLocalDate(rs.getDate("TripDate")));
        Time departure = rs.getTime("DepartureTime");
        snapshot.setDepartureTime(departure == null ? null : departure.toLocalTime());
        snapshot.setDuration(rs.getString("Duration"));
        snapshot.setPaymentStatus(rs.getString("PaymentStatus"));
        return snapshot;
    };

    public Optional<FeedbackResponse> findFeedbackById(Integer feedbackId) {
        List<FeedbackResponse> rows =
                jdbc.query(FEEDBACK_SELECT + " WHERE f.FeedbackID = ?", FEEDBACK_MAPPER, feedbackId);
        return rows.stream().findFirst();
    }

    /** Admin table: every filter is optional, any combination is allowed. */
    public List<FeedbackResponse> search(Integer tripId, Integer customerId, Integer minRating, String text) {
        StringBuilder sql = new StringBuilder(FEEDBACK_SELECT).append(" WHERE 1 = 1");
        List<Object> args = new ArrayList<>();

        if (tripId != null) {
            sql.append(" AND b.TripID = ?");
            args.add(tripId);
        }
        if (customerId != null) {
            sql.append(" AND f.CustomerID = ?");
            args.add(customerId);
        }
        if (minRating != null) {
            sql.append(" AND f.Rating >= ?");
            args.add(minRating);
        }
        if (text != null && !text.isBlank()) {
            sql.append(" AND (f.Comment LIKE ? OR u.FirstName LIKE ? OR u.LastName LIKE ? OR t.Route LIKE ?)");
            String like = "%" + text.trim() + "%";
            args.add(like);
            args.add(like);
            args.add(like);
            args.add(like);
        }
        sql.append(" ORDER BY f.FeedbackID DESC");

        return jdbc.query(sql.toString(), FEEDBACK_MAPPER, args.toArray());
    }

    public Optional<BookingSnapshot> findBooking(Integer bookingId) {
        List<BookingSnapshot> rows =
                jdbc.query(BOOKING_SELECT + " WHERE b.BookingID = ?", BOOKING_MAPPER, bookingId);
        return rows.stream().findFirst();
    }

    public List<BookingSnapshot> findBookingsByCustomer(Integer customerId) {
        return jdbc.query(BOOKING_SELECT + " WHERE b.CustomerID = ? ORDER BY t.TripDate DESC, t.DepartureTime DESC",
                BOOKING_MAPPER, customerId);
    }

    public Optional<String> findRoute(Integer tripId) {
        List<String> routes = jdbc.queryForList("SELECT Route FROM TRIP WHERE TripID = ?", String.class, tripId);
        return routes.stream().findFirst();
    }

    public boolean userExists(Integer userId) {
        Integer count = jdbc.queryForObject("SELECT COUNT(*) FROM [USER] WHERE UserID = ?", Integer.class, userId);
        return count != null && count > 0;
    }

    /** Aggregated rating for one trip, built in a single pass over that trip's reviews. */
    public RatingSummaryResponse summaryForTrip(Integer tripId, String route) {
        String sql = """
                SELECT f.Rating AS Rating, COUNT(*) AS Total
                FROM FEEDBACK f
                JOIN BOOKING b ON b.BookingID = f.BookingID
                WHERE b.TripID = ?
                GROUP BY f.Rating
                """;

        RatingSummaryResponse summary = RatingSummaryResponse.empty(tripId, route);
        long total = 0;
        long weighted = 0;

        for (RatingBucket bucket : jdbc.query(sql, (rs, i) -> new RatingBucket(rs.getInt("Rating"), rs.getLong("Total")), tripId)) {
            summary.getDistribution().put(bucket.stars(), bucket.count());
            total += bucket.count();
            weighted += (long) bucket.stars() * bucket.count();
        }

        summary.setTotalReviews(total);
        summary.setAverageRating(total == 0 ? 0d : Math.round((double) weighted / total * 10d) / 10d);
        return summary;
    }

    private record RatingBucket(int stars, long count) { }

    private static String fullName(String first, String last) {
        String name = ((first == null ? "" : first) + " " + (last == null ? "" : last)).trim();
        return name.isEmpty() ? "AquaSafari customer" : name;
    }

    private static java.time.LocalDate toLocalDate(Date date) throws SQLException {
        return date == null ? null : date.toLocalDate();
    }
}
