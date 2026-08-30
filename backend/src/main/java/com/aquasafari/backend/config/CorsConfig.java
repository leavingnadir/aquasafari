package com.aquasafari.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * SHARED CONFIG - applies to every module's controllers, not just Payment.
 * Only one copy of this file should exist in the repo (backend/src/main/java/
 * com/aquasafari/backend/config/CorsConfig.java). If a teammate already added
 * one, do not duplicate it - just make sure it matches this.
 *
 * Allows the Vite dev server (localhost:5173) to call the Spring Boot API
 * (localhost:8080) during local development.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
