package com.aquasafari.backend.booking.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Turns on @Scheduled support so ReservationExpiryJob runs.
 * Safe to keep even if another module also declares @EnableScheduling
 * elsewhere in the shared project - Spring tolerates it being enabled
 * more than once.
 */
@Configuration
@EnableScheduling
public class SchedulingConfig {
}
