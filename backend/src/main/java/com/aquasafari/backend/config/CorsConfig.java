package com.aquasafari.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * App-wide CORS config so the React dev server (localhost:5173) can call every module's
 * endpoints on localhost:8080.
 *
 * NOTE FOR THE TEAM: only ONE of these should exist in the whole backend. If another module
 * has already added a WebMvcConfigurer / CorsConfig, don't add this file — just make sure
 * theirs allows "/api/**" from localhost:5173. This is included here in case Boat Management
 * is the first module wiring it up.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
