package com.aquasafari.backend.usernadmin.repository;

import com.aquasafari.backend.usernadmin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Base repository across all roles (used for cross-role checks, e.g. unique email).
 */
public interface UserRepository extends JpaRepository<User, Long> {

    boolean existsByEmail(String email);
}
