package com.aquasafari.backend.boat;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BoatService {

    private final BoatRepository boatRepository;

    public BoatService(BoatRepository boatRepository) {
        this.boatRepository = boatRepository;
    }

    /** Use-case step 2: retrieve and display existing boat entries with status indicators. */
    public List<BoatResponseDTO> getAllBoats() {
        return boatRepository.findAll().stream()
                .map(BoatResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public BoatResponseDTO getBoatById(Long id) {
        Boat boat = findBoatOrThrow(id);
        return BoatResponseDTO.fromEntity(boat);
    }

    /** "View Available Boats" use case. */
    public List<BoatResponseDTO> getAvailableBoats() {
        return boatRepository.findByStatus(BoatStatus.AVAILABLE).stream()
                .map(BoatResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Use-case steps 3–6: admin inputs new boat credentials, assigns an operator, system
     * validates and saves. Extension 3a: reject duplicate Boat ID / registration.
     */
    public BoatResponseDTO createBoat(BoatRequestDTO request) {
        if (boatRepository.existsByBoatId(request.getBoatId())) {
            throw new DuplicateBoatIdException(request.getBoatId());
        }

        Boat boat = new Boat();
        applyRequestToEntity(request, boat);

        Boat saved = boatRepository.save(boat);
        return BoatResponseDTO.fromEntity(saved);
    }

    public BoatResponseDTO updateBoat(Long id, BoatRequestDTO request) {
        Boat boat = findBoatOrThrow(id);

        if (boatRepository.existsByBoatIdAndIdNot(request.getBoatId(), id)) {
            throw new DuplicateBoatIdException(request.getBoatId());
        }

        applyRequestToEntity(request, boat);
        Boat saved = boatRepository.save(boat);
        return BoatResponseDTO.fromEntity(saved);
    }

    public void deleteBoat(Long id) {
        Boat boat = findBoatOrThrow(id);
        boatRepository.delete(boat);
    }

    private Boat findBoatOrThrow(Long id) {
        return boatRepository.findById(id)
                .orElseThrow(() -> new BoatNotFoundException(id));
    }

    private void applyRequestToEntity(BoatRequestDTO request, Boat boat) {
        boat.setBoatId(request.getBoatId());
        boat.setName(request.getName());
        boat.setBoatType(request.getBoatType());
        boat.setPassengerCapacity(request.getPassengerCapacity());
        boat.setEngineType(request.getEngineType());
        boat.setBoatOperatorId(request.getBoatOperatorId());

        if (request.getCondition() != null) {
            boat.setCondition(request.getCondition());
        }
        if (request.getStatus() != null) {
            boat.setStatus(request.getStatus());
        } else if (boat.getStatus() == null) {
            boat.setStatus(BoatStatus.AVAILABLE);
        }
    }
}
