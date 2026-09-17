package com.aquasafari.backend.feedback.repository;

import com.aquasafari.backend.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/** Writes and single-table reads on FEEDBACK. Joined reads live in FeedbackQueryRepository. */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

    /** One review per booking: used to block a second submission for the same trip. */
    Optional<Feedback> findByBookingId(Integer bookingId);

    boolean existsByBookingId(Integer bookingId);

    List<Feedback> findByCustomerIdOrderByFeedbackIdDesc(Integer customerId);

    long countByCustomerId(Integer customerId);
}
