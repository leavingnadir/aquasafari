package com.aquasafari.backend.booking.controller;

import com.aquasafari.backend.booking.dto.BookingRequestDTO;
import com.aquasafari.backend.booking.dto.BookingResponseDTO;
import com.aquasafari.backend.booking.dto.TripAvailabilityDTO;
import com.aquasafari.backend.booking.service.BookingService;
import com.aquasafari.backend.usernadmin.entity.User;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // NEW: Get all bookings to view data in browser at /api/bookings
    @GetMapping
    public List<BookingResponseDTO> getAllBookings() {
        return bookingService.getAllBookings();
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
    public BookingResponseDTO bookTrip(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody BookingRequestDTO request) {
        return bookingService.bookTrip(request, user.getUserId());
    }

    @GetMapping("/mine")
    public List<BookingResponseDTO> viewMyBookings(@AuthenticationPrincipal User user) {
        return bookingService.viewBookingsForCustomer(user.getUserId());
    }

    @GetMapping("/mine/{bookingId}")
    public BookingResponseDTO getMyBooking(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookingId) {
        return bookingService.getBookingForCustomer(bookingId, user.getUserId());
    }

    @PostMapping("/mine/{bookingId}/confirm")
    public BookingResponseDTO confirmMyBooking(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookingId) {
        return bookingService.confirmBookingForCustomer(bookingId, user.getUserId());
    }

    @PutMapping("/mine/{bookingId}/cancel")
    public BookingResponseDTO cancelMyBooking(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookingId) {
        return bookingService.cancelBooking(bookingId, user.getUserId());
    }

    @GetMapping("/{bookingId}")
    public BookingResponseDTO getBooking(
            @AuthenticationPrincipal User user,
            @PathVariable Long bookingId) {
        return bookingService.getBookingForCustomer(bookingId, user.getUserId());
    }
}
