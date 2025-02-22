package com.mynewsblog.backend.config;

import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.model.Role;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.repository.RoleRepository;
import com.mynewsblog.backend.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Slf4j
public class DataInitializer {

    @Value("${default.admin.username}")
    private String adminUsername;

    @Value("${default.admin.email}")
    private String adminEmail;

    @Value("${default.admin.password}")
    private String adminPassword;

    @Bean
    public CommandLineRunner initDatabase(RoleRepository roleRepo,
                                          UserRepository userRepo,
                                          PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed roles if they do not exist
            if (roleRepo.findByName("ADMIN").isEmpty()) {
                roleRepo.save(Role.builder().name("ADMIN").build());
            }
            if (roleRepo.findByName("EDITOR").isEmpty()) {
                roleRepo.save(Role.builder().name("EDITOR").build());
            }
            log.info("DataInitializer: Roles seeded successfully.");

            // Seed a default admin user if none exists
            if (userRepo.findByRole_Name("ADMIN").isEmpty()) {
                // Ensure the injected admin credentials are present
                if (adminUsername == null || adminPassword == null) {
                    throw new IllegalStateException("Default admin credentials must be set in application.properties.");
                }

                Role adminRole = roleRepo.findByName("ADMIN")
                        .orElseThrow(() -> new ResourceNotFoundException("Admin role not found"));

                User admin = User.builder()
                        .username(adminUsername)
                        .email(adminEmail)
                        .password(passwordEncoder.encode(adminPassword))
                        .role(adminRole)
                        .build();

                userRepo.save(admin);
                log.info("DataInitializer: Default admin user seeded successfully.");
            }
        };
    }
}
