package com.aquasafari.backend.booking.service.impl;

import com.aquasafari.backend.booking.dto.BookingRequestDTO;
import com.aquasafari.backend.booking.dto.BookingResponseDTO;
import com.aquasafari.backend.booking.dto.TripAvailabilityDTO;
import com.aquasafari.backend.booking.entity.Booking;
import com.aquasafari.backend.booking.entity.BookingStatus;
import com.aquasafari.backend.booking.repository.BookingRepository;
import com.aquasafari.backend.booking.service.BookingService;
import com.aquasafari.backend.booking.service.TripLookupService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final TripLookupService tripLookupService;

    /** How long a PENDING reservation is held before it expires (Extension 4a). */
    @Value("${app.booking.reservation-window-minutes:10}")
    private long reservationWindowMinutes;

    public BookingServiceImpl(BookingRepository bookingRepository, TripLookupService tripLookupService) {
        this.bookingRepository = bookingRepository;
        this.tripLookupService = tripLookupService;
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(BookingResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public List<TripAvailabilityDTO> searchTrips(String route, LocalDate tripDate) {
        return tripLookupService.searchTrips(route, tripDate);
    }

    @Override
    public TripAvailabilityDTO getTripAvailability(Long tripId) {
        return tripLookupService.getTripAvailability(tripId);
    }

    @Override
    @Transactional
    public BookingResponseDTO bookTrip(BookingRequestDTO request) {
        TripAvailabilityDTO trip = tripLookupService.getTripAvailability(request.getTripId());

        if (request.getPassengerCount() > trip.getSeatsAvailable()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Only " + trip.getSeatsAvailable() + " seat(s) left on this trip");
        }

        Booking booking = new Booking();
        booking.setCustomerId(request.getCustomerId());
        booking.setTripId(request.getTripId());
        booking.setPassengerCount(request.getPassengerCount());
        booking.setBookingDate(LocalDate.now());
        booking.setBookingStatus(BookingStatus.PENDING);
        booking.setReservationExpiresAt(LocalDateTime.now().plusMinutes(reservationWindowMinutes));

        Booking saved = bookingRepository.save(booking);
        return BookingResponseDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public BookingResponseDTO confirmBooking(Long bookingId) {
        Booking booking = findBookingOrThrow(bookingId);

        if (booking.getBookingStatus() == BookingStatus.EXPIRED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Reservation expired before payment was completed");
        }
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking was already cancelled");
        }

        booking.setBookingStatus(BookingStatus.CONFIRMED);
        booking.setReservationExpiresAt(null);
        return BookingResponseDTO.fromEntity(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public BookingResponseDTO cancelBooking(Long bookingId, Long customerId) {
        Booking booking = findBookingOrThrow(bookingId);

        if (!booking.getCustomerId().equals(customerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This booking does not belong to you");
        }
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking is already cancelled");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setReservationExpiresAt(null);
        return BookingResponseDTO.fromEntity(bookingRepository.save(booking));
    }

    @Override
    public List<BookingResponseDTO> viewBookingsForCustomer(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByBookingDateDesc(customerId)
                .stream()
                .map(BookingResponseDTO::fromEntity)
                .toList();
    }

    @Override
    public BookingResponseDTO getBooking(Long bookingId) {
        return BookingResponseDTO.fromEntity(findBookingOrThrow(bookingId));
    }

    private Booking findBookingOrThrow(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found: " + bookingId));
    }
}
