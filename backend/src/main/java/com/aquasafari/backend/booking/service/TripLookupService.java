package com.aquasafari.backend.booking.service;

import com.aquasafari.backend.booking.dto.TripAvailabilityDTO;
import com.aquasafari.backend.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * Reads trip + boat data straight from the shared SQL Server tables using
 * plain SQL, instead of depending on the Trip module's @Entity classes.
 *
 * WHY: this module (Booking) is developed in parallel with the Trip module
 * on the same branch. Coupling to com.aquasafari.backend.trip.entity.Trip
 * would break this module's compile every time that teammate refactors
 * their entity. Native SQL against the agreed EER column names is a stable
 * contract both modules can rely on.
 *
 * ASSUMPTIONS (please confirm with the Trip and Boat module owners):
 *   trip table : trip_id, route, trip_date, departure_time, duration, boat_id
 *   boat table : boat_id, boat_type, capacity, condition
 * These match the EER diagram field names translated to snake_case, which is
 * the default Hibernate physical naming strategy for camelCase @Column-less
 * fields. If a teammate names a column differently, update the SQL below.
 *
 * PRICE: the EER diagram has no price/cost field anywhere on TRIP, BOAT or
 * BOOKING, but the use case requires showing a total cost. Until the team
 * agrees where price lives, a flat configurable rate is used
 * (app.booking.default-price-per-seat in application.properties).
 */
@Service
public class TripLookupService {

    private final JdbcTemplate jdbcTemplate;
    private final BookingRepository bookingRepository;

    @Value("${app.booking.default-price-per-seat:2500.00}")
    private BigDecimal defaultPricePerSeat;

    public TripLookupService(JdbcTemplate jdbcTemplate, BookingRepository bookingRepository) {
        this.jdbcTemplate = jdbcTemplate;
        this.bookingRepository = bookingRepository;
    }

    /**
     * Search Trips: optional route keyword + optional date, returns each
     * matching trip with live seat availability.
     */
    public List<TripAvailabilityDTO> searchTrips(String routeKeyword, LocalDate tripDate) {
        StringBuilder sql = new StringBuilder(
                "SELECT t.trip_id, t.route, t.trip_date, t.departure_time, t.duration, b.capacity " +
                "FROM trip t JOIN boat b ON t.boat_id = b.boat_id WHERE 1=1");
        List<Object> params = new java.util.ArrayList<>();

        if (routeKeyword != null && !routeKeyword.isBlank()) {
            sql.append(" AND t.route LIKE ?");
            params.add("%" + routeKeyword + "%");
        }
        if (tripDate != null) {
            sql.append(" AND t.trip_date = ?");
            params.add(tripDate);
        }
        sql.append(" ORDER BY t.trip_date ASC, t.departure_time ASC");

        return jdbcTemplate.query(sql.toString(), (rs, rowNum) -> {
            Long tripId = rs.getLong("trip_id");
            Integer capacity = rs.getInt("capacity");
            Integer reserved = bookingRepository.countReservedSeatsForTrip(tripId, LocalDateTime.now());
            TripAvailabilityDTO dto = new TripAvailabilityDTO(
                    tripId,
                    rs.getString("route"),
                    rs.getDate("trip_date").toLocalDate(),
                    rs.getTime("departure_time").toLocalTime(),
                    rs.getInt("duration"),
                    capacity,
                    reserved,
                    defaultPricePerSeat
            );
            return dto;
        }, params.toArray());
    }

    /**
     * Fetches a single trip's availability, used when the customer proceeds
     * to book (step 2-4 of the main scenario).
     */
    public TripAvailabilityDTO getTripAvailability(Long tripId) {
        String sql = "SELECT t.trip_id, t.route, t.trip_date, t.departure_time, t.duration, b.capacity " +
                "FROM trip t JOIN boat b ON t.boat_id = b.boat_id WHERE t.trip_id = ?";

        List<TripAvailabilityDTO> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Integer capacity = rs.getInt("capacity");
            Integer reserved = bookingRepository.countReservedSeatsForTrip(tripId, LocalDateTime.now());
            return new TripAvailabilityDTO(
                    tripId,
                    rs.getString("route"),
                    rs.getDate("trip_date").toLocalDate(),
                    rs.getTime("departure_time").toLocalTime(),
                    rs.getInt("duration"),
                    capacity,
                    reserved,
                    defaultPricePerSeat
            );
        }, tripId);

        if (results.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found: " + tripId);
        }
        return results.get(0);
    }
}
