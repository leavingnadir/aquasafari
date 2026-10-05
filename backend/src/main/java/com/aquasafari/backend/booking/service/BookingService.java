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

    BookingResponseDTO bookTrip(BookingRequestDTO request, Long customerId);

    BookingResponseDTO cancelBooking(Long bookingId, Long customerId);

    BookingResponseDTO cancelBookingByAdmin(Long bookingId);

    List<BookingResponseDTO> viewBookingsForCustomer(Long customerId);

    BookingResponseDTO getBooking(Long bookingId);

    BookingResponseDTO confirmBooking(Long bookingId);

    BookingResponseDTO confirmBookingForCustomer(Long bookingId, Long customerId);

    BookingResponseDTO getBookingForCustomer(Long bookingId, Long customerId);
}
