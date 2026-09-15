package com.aquasafari.backend.trip;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Read-only lookups that feed the boat / operator / guide dropdowns on the trip
 * screens. Native queries are used on purpose: BOAT and [USER] are owned by other
 * modules, and this way the trip pages keep working no matter what shape their
 * own REST endpoints end up taking. Nothing here writes to those tables.
 */
@RestController
@RequestMapping("/api/trips/resources")
public class TripResourceController {

    @PersistenceContext
    private EntityManager entityManager;

    @GetMapping("/boats")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> boats() {
        List<Object[]> rows = entityManager
                .createNativeQuery("SELECT BoatID, BoatType, Capacity, Condition FROM BOAT ORDER BY BoatID")
                .getResultList();

        List<Map<String, Object>> boats = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> boat = new LinkedHashMap<>();
            boat.put("id", row[0]);
            boat.put("label", row[1] + " (capacity " + row[2] + ")");
            boat.put("capacity", row[2]);
            boat.put("condition", row[3]);
            boats.add(boat);
        }
        return boats;
    }

    @GetMapping("/operators")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> operators() {
        return people("BOAT_OPERATOR");
    }

    @GetMapping("/guides")
    @Transactional(readOnly = true)
    public List<Map<String, Object>> guides() {
        return people("TOUR_GUIDE");
    }

    private List<Map<String, Object>> people(String userType) {
        List<Object[]> rows = entityManager
                .createNativeQuery("SELECT UserID, FirstName, LastName, Email FROM [USER] "
                        + "WHERE user_type = :type ORDER BY FirstName")
                .setParameter("type", userType)
                .getResultList();

        List<Map<String, Object>> people = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> person = new LinkedHashMap<>();
            person.put("id", row[0]);
            person.put("label", (row[1] + " " + row[2]).trim());
            person.put("email", row[3]);
            people.add(person);
        }
        return people;
    }
}
