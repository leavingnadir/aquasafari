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
 * plain SQL, matching the PascalCase column names in the database schema.
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
     * matching trip with live seat availability using PascalCase columns.
     */
    public List<TripAvailabilityDTO> searchTrips(String routeKeyword, LocalDate tripDate) {
        StringBuilder sql = new StringBuilder(
                "SELECT t.TripID, t.Route, t.TripDate, t.DepartureTime, t.Duration, b.Capacity " +
                "FROM TRIP t JOIN BOAT b ON t.BoatID = b.BoatID WHERE 1=1");
        List<Object> params = new java.util.ArrayList<>();

        if (routeKeyword != null && !routeKeyword.isBlank()) {
            sql.append(" AND t.Route LIKE ?");
            params.add("%" + routeKeyword + "%");
        }
        if (tripDate != null) {
            sql.append(" AND t.TripDate = ?");
            params.add(tripDate);
        }
        sql.append(" ORDER BY t.TripDate ASC, t.DepartureTime ASC");

        return jdbcTemplate.query(sql.toString(), (rs, rowNum) -> {
            Long tripId = rs.getLong("TripID");
            Integer capacity = rs.getInt("Capacity");
            Integer reserved = bookingRepository.countReservedSeatsForTrip(tripId, LocalDateTime.now());
            TripAvailabilityDTO dto = new TripAvailabilityDTO(
                    tripId,
                    rs.getString("Route"),
                    rs.getDate("TripDate").toLocalDate(),
                    rs.getTime("DepartureTime").toLocalTime(),
                    rs.getInt("Duration"),
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
        String sql = "SELECT t.TripID, t.Route, t.TripDate, t.DepartureTime, t.Duration, b.Capacity " +
                "FROM TRIP t JOIN BOAT b ON t.BoatID = b.BoatID WHERE t.TripID = ?";

        List<TripAvailabilityDTO> results = jdbcTemplate.query(sql, (rs, rowNum) -> {
            Integer capacity = rs.getInt("Capacity");
            Integer reserved = bookingRepository.countReservedSeatsForTrip(tripId, LocalDateTime.now());
            return new TripAvailabilityDTO(
                    tripId,
                    rs.getString("Route"),
                    rs.getDate("TripDate").toLocalDate(),
                    rs.getTime("DepartureTime").toLocalTime(),
                    rs.getInt("Duration"),
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
