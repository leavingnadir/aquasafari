package com.aquasafari.backend.trip;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class TripService {

    private final TripRepository tripRepository;

    public TripService(TripRepository tripRepository) {
        this.tripRepository = tripRepository;
    }

    /* ------------------------------- read ------------------------------- */

    @Transactional(readOnly = true)
    public List<Trip> findAll() {
        return tripRepository.findAllByOrderByTripDateAscDepartureTimeAsc();
    }

    @Transactional(readOnly = true)
    public Trip findById(Integer id) {
        return tripRepository.findById(id).orElseThrow(() -> new TripNotFoundException(id));
    }

    /**
     * Public listing (use case step 6). The shared TRIP table has no status column,
     * so a trip counts as available to customers once its date is today or later.
     */
    @Transactional(readOnly = true)
    public List<Trip> findAvailable(String route, LocalDate date) {
        String routeFilter = (route == null || route.isBlank()) ? null : route.trim();
        LocalDate fromDate = (date == null) ? LocalDate.now() : null;
        return tripRepository.search(routeFilter, date, fromDate);
    }

    @Transactional(readOnly = true)
    public List<Trip> findByBoat(Integer boatId) {
        return tripRepository.findByBoatIdOrderByTripDateAsc(boatId);
    }

    /* ------------------------------ create ------------------------------ */

    @Transactional
    public Trip create(Trip trip) {
        trip.setTripId(null);
        requireFreeSlot(trip, null);
        return tripRepository.save(trip);
    }

    /* ------------------------------ update ------------------------------ */

    @Transactional
    public Trip update(Integer id, Trip incoming) {
        Trip existing = findById(id);

        existing.setRoute(incoming.getRoute());
        existing.setTripDate(incoming.getTripDate());
        existing.setDepartureTime(incoming.getDepartureTime());
        existing.setDuration(incoming.getDuration());
        existing.setPrice(incoming.getPrice());
        existing.setBoatId(incoming.getBoatId());
        existing.setOperatorId(incoming.getOperatorId());
        existing.setGuideId(incoming.getGuideId());

        requireFreeSlot(existing, id);
        return tripRepository.save(existing);
    }

    /** Assign boat, operator and guide to an existing trip (use case step 3). */
    @Transactional
    public Trip assignResources(Integer id, Integer boatId, Integer operatorId, Integer guideId) {
        Trip trip = findById(id);
        if (boatId == null || operatorId == null || guideId == null) {
            throw new IllegalArgumentException("A trip needs a boat, a boat operator and a tour guide");
        }
        trip.setBoatId(boatId);
        trip.setOperatorId(operatorId);
        trip.setGuideId(guideId);

        requireFreeSlot(trip, id);
        return tripRepository.save(trip);
    }

    /* ------------------------------ delete ------------------------------ */

    @Transactional
    public void delete(Integer id) {
        Trip trip = findById(id);
        try {
            tripRepository.delete(trip);
            tripRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            // BOOKING.TripID has a foreign key to this row
            throw new IllegalStateException(
                    "This trip has bookings against it. Cancel those bookings first, then delete the trip.");
        }
    }

    /* ----------------------------- conflicts ----------------------------- */

    private void requireFreeSlot(Trip candidate, Integer ignoreTripId) {
        List<String> conflicts = detectConflicts(candidate, ignoreTripId);
        if (!conflicts.isEmpty()) {
            throw new ScheduleConflictException(conflicts);
        }
    }

    /**
     * Returns one readable line per resource already committed to an overlapping
     * slot on the same date. An empty list means the slot is free.
     *
     * @param ignoreTripId the trip being edited, or null when creating
     */
    @Transactional(readOnly = true)
    public List<String> detectConflicts(Trip candidate, Integer ignoreTripId) {
        List<String> conflicts = new ArrayList<>();
        if (candidate.getTripDate() == null || candidate.getDepartureTime() == null) {
            return conflicts;
        }

        for (Trip other : tripRepository.findByTripDate(candidate.getTripDate())) {
            if (ignoreTripId != null && ignoreTripId.equals(other.getTripId())) continue;
            if (other.getDepartureTime() == null) continue;
            if (!(candidate.startMinute() < other.endMinute() && other.startMinute() < candidate.endMinute())) continue;

            String slot = other.getDepartureTime().toString().substring(0, 5)
                    + " on " + other.getTripDate()
                    + " (trip #" + other.getTripId() + ", " + other.getRoute() + ")";

            if (Objects.equals(candidate.getBoatId(), other.getBoatId()) && candidate.getBoatId() != null) {
                conflicts.add("Boat " + candidate.getBoatId() + " is already out at " + slot);
            }
            if (Objects.equals(candidate.getOperatorId(), other.getOperatorId()) && candidate.getOperatorId() != null) {
                conflicts.add("Boat operator " + candidate.getOperatorId() + " is already assigned at " + slot);
            }
            if (Objects.equals(candidate.getGuideId(), other.getGuideId()) && candidate.getGuideId() != null) {
                conflicts.add("Tour guide " + candidate.getGuideId() + " is already assigned at " + slot);
            }
        }
        return conflicts;
    }
}
