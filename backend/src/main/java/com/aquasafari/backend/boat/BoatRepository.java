package com.aquasafari.backend.boat;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoatRepository extends JpaRepository<Boat, Long> {

    Optional<Boat> findByBoatId(String boatId);

    boolean existsByBoatId(String boatId);

    /** Used when editing a boat: is this boatId taken by a *different* row? */
    boolean existsByBoatIdAndIdNot(String boatId, Long id);

    List<Boat> findByStatus(BoatStatus status);
}
