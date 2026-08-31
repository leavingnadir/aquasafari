package com.aquasafari.backend.booking.repository;

import com.aquasafari.backend.booking.entity.Booking;
import com.aquasafari.backend.booking.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByCustomerIdOrderByBookingDateDesc(Long customerId);

    List<Booking> findByTripId(Long tripId);

    /**
     * Seats currently held for a trip: anything CONFIRMED, or PENDING and not
     * yet expired. Used to compute live seat availability when searching trips.
     */
    @Query("SELECT COALESCE(SUM(b.passengerCount), 0) FROM Booking b " +
           "WHERE b.tripId = :tripId " +
           "AND (b.bookingStatus = com.aquasafari.backend.booking.entity.BookingStatus.CONFIRMED " +
           "     OR (b.bookingStatus = com.aquasafari.backend.booking.entity.BookingStatus.PENDING " +
           "         AND b.reservationExpiresAt > :now))")
    Integer countReservedSeatsForTrip(@Param("tripId") Long tripId, @Param("now") LocalDateTime now);

    /**
     * Picked up by the scheduled cleanup job that implements Extension 4a:
     * PENDING bookings whose reservation window has passed.
     */
    List<Booking> findByBookingStatusAndReservationExpiresAtBefore(BookingStatus status, LocalDateTime cutoff);
}
