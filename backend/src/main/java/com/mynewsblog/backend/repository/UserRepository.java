package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email); // Get user email

    // Get users by role (using property path notation to access role's name)
    List<User> findByRole_Name(String roleName);  // Useful for admins listing editors, etc.
}
