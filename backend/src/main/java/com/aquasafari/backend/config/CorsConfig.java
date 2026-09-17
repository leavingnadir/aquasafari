package com.aquasafari.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * App-wide CORS config so the React dev server (localhost:5173) can call every module's
 * endpoints on localhost:8080.
 *
 * NOTE FOR THE TEAM: only ONE of these should exist in the whole backend. If you are
 * adding a module and this file is already here, do not create another CorsConfig or
 * another WebMvcConfigurer, and do not put @CrossOrigin on your controller - this file
 * already covers /api/**, which includes your endpoints.
 *
 * Origins are read from aquasafari.cors.allowed-origins in application.properties, as a
 * comma-separated list. The default below is used when that key is missing, so the app
 * still starts on a teammate's machine who has not pulled the properties file yet:
 *
 *   aquasafari.cors.allowed-origins=http://localhost:5173,http://127.0.0.1:5173
 *
 * If someone runs Vite on a different port (5174 when 5173 is busy), add that origin to
 * the property rather than editing this class.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    private final String[] allowedOrigins;

    public CorsConfig(
            @Value("${aquasafari.cors.allowed-origins:http://localhost:5173,http://127.0.0.1:5173}")
            String[] allowedOrigins) {
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins(allowedOrigins)
                // PATCH is included so nobody has to touch this file later to add it.
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                // Browsers cache the preflight result for an hour instead of sending an
                // OPTIONS request before every single call.
                .maxAge(3600);
    }
}