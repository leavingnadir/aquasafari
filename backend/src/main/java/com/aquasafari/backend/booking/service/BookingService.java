package com.aquasafari.backend.booking.service;

import com.aquasafari.backend.booking.dto.BookingRequestDTO;
import com.aquasafari.backend.booking.dto.BookingResponseDTO;
import com.aquasafari.backend.booking.dto.TripAvailabilityDTO;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    // NEW: Declaration for getting all bookings
    List<BookingResponseDTO> getAllBookings();

    List<TripAvailabilityDTO> searchTrips(String route, LocalDate tripDate);

    TripAvailabilityDTO getTripAvailability(Long tripId);

    BookingResponseDTO bookTrip(BookingRequestDTO request);

    BookingResponseDTO cancelBooking(Long bookingId, Long customerId);

    List<BookingResponseDTO> viewBookingsForCustomer(Long customerId);

    BookingResponseDTO getBooking(Long bookingId);

    BookingResponseDTO confirmBooking(Long bookingId);
}
