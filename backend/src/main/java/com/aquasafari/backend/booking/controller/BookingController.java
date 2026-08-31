package com.aquasafari.backend.booking.controller;

import com.aquasafari.backend.booking.dto.BookingRequestDTO;
import com.aquasafari.backend.booking.dto.BookingResponseDTO;
import com.aquasafari.backend.booking.dto.TripAvailabilityDTO;
import com.aquasafari.backend.booking.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Endpoints for the Booking Management module.
 *
 *   GET    /api/bookings/trips/search?route=&date=   -> Search Trips
 *   POST   /api/bookings                              -> Book Trip
 *   POST   /api/bookings/{id}/confirm                  -> called by Payment module after payment succeeds
 *   PUT    /api/bookings/{id}/cancel?customerId=       -> Cancel Booking
 *   GET    /api/bookings/customer/{customerId}         -> View Bookings
 *   GET    /api/bookings/{id}                          -> View a single booking
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/trips/search")
    public List<TripAvailabilityDTO> searchTrips(
            @RequestParam(required = false) String route,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return bookingService.searchTrips(route, date);
    }

    @GetMapping("/trips/{tripId}")
    public TripAvailabilityDTO getTripAvailability(@PathVariable Long tripId) {
        return bookingService.getTripAvailability(tripId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponseDTO bookTrip(@Valid @RequestBody BookingRequestDTO request) {
        return bookingService.bookTrip(request);
    }

    @PostMapping("/{bookingId}/confirm")
    public BookingResponseDTO confirmBooking(@PathVariable Long bookingId) {
        return bookingService.confirmBooking(bookingId);
    }

    @PutMapping("/{bookingId}/cancel")
    public BookingResponseDTO cancelBooking(@PathVariable Long bookingId, @RequestParam Long customerId) {
        return bookingService.cancelBooking(bookingId, customerId);
    }

    @GetMapping("/customer/{customerId}")
    public List<BookingResponseDTO> viewBookings(@PathVariable Long customerId) {
        return bookingService.viewBookingsForCustomer(customerId);
    }

    @GetMapping("/{bookingId}")
    public BookingResponseDTO getBooking(@PathVariable Long bookingId) {
        return bookingService.getBooking(bookingId);
    }
}
