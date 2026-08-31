package com.aquasafari.backend.usernadmin.security;

import com.aquasafari.backend.usernadmin.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // User implements UserDetails directly, so no adapter mapping needed.
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No account found for: " + email));
    }
}
