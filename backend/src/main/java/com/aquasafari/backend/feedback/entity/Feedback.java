package com.aquasafari.backend.feedback.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Maps 1:1 onto the FEEDBACK table already created by the group's seed-data.sql:
 *
 *   FeedbackID  INT IDENTITY PRIMARY KEY
 *   BookingID   INT NOT NULL  -> BOOKING(BookingID)
 *   CustomerID  INT NOT NULL  -> [USER](UserID)
 *   Rating      INT CHECK (Rating BETWEEN 1 AND 5)
 *   Comment     VARCHAR(500)
 *
 * The two foreign keys are held as plain Integer ids on purpose. The BOOKING and
 * [USER] tables belong to teammates' modules, so mapping them as @ManyToOne would
 * make this module fail to compile until their @Entity classes are pushed, and would
 * risk two different Hibernate mappings for the same table. All joins this module
 * needs (customer name, trip route, payment status) are done with read-only SQL in
 * FeedbackQueryRepository instead.
 */
@Entity
@Table(name = "FEEDBACK")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FeedbackID")
    private Integer feedbackId;

    @Column(name = "BookingID", nullable = false)
    private Integer bookingId;

    @Column(name = "CustomerID", nullable = false)
    private Integer customerId;

    @Column(name = "Rating", nullable = false)
    private Integer rating;

    @Column(name = "Comment", length = 500)
    private String comment;

    public Feedback() {
    }

    public Feedback(Integer bookingId, Integer customerId, Integer rating, String comment) {
        this.bookingId = bookingId;
        this.customerId = customerId;
        this.rating = rating;
        this.comment = comment;
    }

    public Integer getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Integer feedbackId) {
        this.feedbackId = feedbackId;
    }

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }

    public Integer getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Integer customerId) {
        this.customerId = customerId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }
}
