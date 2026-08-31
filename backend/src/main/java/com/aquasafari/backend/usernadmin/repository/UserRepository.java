package com.aquasafari.backend.usernadmin.repository;

import com.aquasafari.backend.usernadmin.entity.Customer;
import com.aquasafari.backend.usernadmin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    /**
     * Every non-customer account (Administrator/BoatOperator/TourGuide/
     * Accountant), for the admin-only Staff Management screen.
     * getRole() is a Java method, not a persisted column, so this can't be
     * a derived query name - it queries the JPA discriminator directly via
     * TYPE() instead.
     */
    @Query("SELECT u FROM User u WHERE TYPE(u) <> Customer")
    List<User> findAllStaff();
}
