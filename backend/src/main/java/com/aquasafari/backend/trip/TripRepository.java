package com.aquasafari.backend.trip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Integer> {

    List<Trip> findAllByOrderByTripDateAscDepartureTimeAsc();

    /** Candidate set for conflict checks: everything already booked on that date. */
    List<Trip> findByTripDate(LocalDate tripDate);

    @Query("""
           SELECT t FROM Trip t
           WHERE (:route IS NULL OR LOWER(t.route) LIKE LOWER(CONCAT('%', :route, '%')))
             AND (:date IS NULL OR t.tripDate = :date)
             AND (:fromDate IS NULL OR t.tripDate >= :fromDate)
           ORDER BY t.tripDate ASC, t.departureTime ASC
           """)
    List<Trip> search(@Param("route") String route,
                      @Param("date") LocalDate date,
                      @Param("fromDate") LocalDate fromDate);

    List<Trip> findByBoatIdOrderByTripDateAsc(Integer boatId);

    List<Trip> findByOperatorIdOrderByTripDateAsc(Integer operatorId);

    List<Trip> findByGuideIdOrderByTripDateAsc(Integer guideId);
}
