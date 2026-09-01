package com.aquasafari.backend.usernadmin.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public - login/register don't require a token[cite: 43]
                        .requestMatchers("/api/auth/**").permitAll()[cite: 43]

                        // Admin-only staff management (Boat Operator / Tour Guide / Accountant / Admin accounts)[cite: 43]
                        .requestMatchers("/api/admin/staff/**").hasRole("ADMIN")[cite: 43]

                        // Customer records - Admin manages them (matches the use case diagram's[cite: 43]
                        // "Ext.P: When administrator manages customer details")[cite: 43]
                        .requestMatchers("/api/admin/customers/**").hasRole("ADMIN")

                        // Accountant-only: payment history, correcting or deleting records[cite: 43]
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/payments/history").hasAnyRole("ADMIN", "ACCOUNTANT")[cite: 43]
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/payments/**").hasAnyRole("ADMIN", "ACCOUNTANT")[cite: 43]
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/payments/**").hasAnyRole("ADMIN", "ACCOUNTANT")[cite: 43]
                        // Customers can process their own payment and view their own receipt[cite: 43]
                        .requestMatchers("/api/payments/**").authenticated()[cite: 43]

                        // Everything else needs a valid token, role open[cite: 43]
                        .anyRequest().authenticated()[cite: 43]
                )
                .authenticationProvider(authenticationProvider())[cite: 43]
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);[cite: 43]

        return http.build();
    }
}
