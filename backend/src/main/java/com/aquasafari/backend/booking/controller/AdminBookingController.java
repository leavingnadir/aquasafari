package com.aquasafari.backend.booking.controller;

import com.aquasafari.backend.booking.dto.BookingResponseDTO;
import com.aquasafari.backend.booking.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminBookingController {

    private final BookingService bookingService;

    public AdminBookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<BookingResponseDTO> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @PostMapping("/{bookingId}/confirm")
    public BookingResponseDTO confirmBooking(@PathVariable Long bookingId) {
        return bookingService.confirmBooking(bookingId);
    }

    @PutMapping("/{bookingId}/cancel")
    public BookingResponseDTO cancelBooking(@PathVariable Long bookingId) {
        return bookingService.cancelBookingByAdmin(bookingId);
    }
}
