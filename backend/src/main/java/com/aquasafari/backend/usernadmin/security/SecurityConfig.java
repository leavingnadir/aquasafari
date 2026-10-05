package com.aquasafari.backend.usernadmin.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpStatus;

import java.util.List;

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
        return NoOpPasswordEncoder.getInstance();
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
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // 1. Public endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/boats", "/api/boats/**").permitAll()
                        .requestMatchers("/api/bookings/mine", "/api/bookings/mine/**")
                        .hasAnyAuthority("ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_ADMINISTRATOR")
                        .requestMatchers(HttpMethod.GET, "/api/bookings")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_ADMINISTRATOR")
                        .requestMatchers("/api/bookings/trips/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/bookings")
                        .hasAnyAuthority("ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_ADMINISTRATOR")
                        .requestMatchers("/api/bookings", "/api/bookings/**").authenticated()
                        .requestMatchers("/api/payments", "/api/payments/**").permitAll()
                        
                        // Added Trip Management module endpoints
                        .requestMatchers("/api/trips", "/api/trips/**").permitAll()
                        .requestMatchers("/api/trips/resources/**").permitAll()
                        
                        // 2. Feedback module routes (requires authentication token)
                        .requestMatchers("/api/feedback/**").authenticated()

                        // 3. Specific Admin module rules
                        .requestMatchers("/api/admin/customers", "/api/admin/customers/**").permitAll() 
                        .requestMatchers("/api/admin/staff", "/api/admin/staff/**")
                        .hasAnyAuthority("ROLE_ADMIN", "ROLE_ADMINISTRATOR")

                        // 4. Catch-all for remaining admin routes
                        .requestMatchers("/api/admin/**").hasAnyAuthority("ROLE_ADMIN", "ROLE_ADMINISTRATOR")

                        // 5. Everything else needs a valid token
                        .anyRequest().authenticated()
                )
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
