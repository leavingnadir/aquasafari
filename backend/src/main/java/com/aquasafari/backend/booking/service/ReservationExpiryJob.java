package com.aquasafari.backend.booking.service;

import com.aquasafari.backend.booking.entity.Booking;
import com.aquasafari.backend.booking.entity.BookingStatus;
import com.aquasafari.backend.booking.repository.BookingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Implements Extension 4a of the Book Trip use case: "Session timeout prior
 * to payment: Reserved seats are released back to the general pool."
 *
 * Runs every minute, finds PENDING bookings whose reservation window has
 * passed, and flips them to EXPIRED so their seats count as free again
 * (see BookingRepository.countReservedSeatsForTrip).
 */
@Component
public class ReservationExpiryJob {

    private static final Logger log = LoggerFactory.getLogger(ReservationExpiryJob.class);

    private final BookingRepository bookingRepository;

    public ReservationExpiryJob(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    @Scheduled(fixedRate = 60_000)
    public void releaseExpiredReservations() {
        List<Booking> expired = bookingRepository
                .findByBookingStatusAndReservationExpiresAtBefore(BookingStatus.PENDING, LocalDateTime.now());

        if (expired.isEmpty()) {
            return;
        }

        for (Booking booking : expired) {
            booking.setBookingStatus(BookingStatus.EXPIRED);
        }
        bookingRepository.saveAll(expired);
        log.info("Released {} expired booking reservation(s) back to the pool", expired.size());
    }
}
