package com.mynewsblog.backend.config;
import com.mynewsblog.backend.model.Role;
import com.mynewsblog.backend.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDatabase(RoleRepository roleRepo) {
        return args -> {
            // Insert ADMIN
            if (roleRepo.findByName("ADMIN").isEmpty()) {
                roleRepo.save(Role.builder().name("ADMIN").build());
            }
            // Insert EDITOR
            if (roleRepo.findByName("EDITOR").isEmpty()) {
                roleRepo.save(Role.builder().name("EDITOR").build());
            }

            System.out.println("DataInitializer: Roles seeded successfully.");
        };
    }
}