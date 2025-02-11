package com.mynewsblog.backend.service;

import com.mynewsblog.backend.dto.UpdateUserRequest;
import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.exception.UsernameAlreadyExistsException;
import com.mynewsblog.backend.model.Role;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.repository.RoleRepository;
import com.mynewsblog.backend.repository.UserRepository;
import com.mynewsblog.backend.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1️⃣ Create user (Editor/Admin)
    public User createUser(String username, String email, String password, String roleName) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists!");
        }

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password)) // 🔹 Hash password
                .role(role)
                .build();

        return userRepository.save(user);
    }

    // 2️⃣ Find user by ID
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    // 3️⃣ List all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 4️⃣ Update user
    public User updateUser(Long userId, UserPrincipal currentUser, UpdateUserRequest request) {
        User user = getUser(userId);

        // 🔹 Ensure only user themselves or an admin can update
        if (!currentUser.getId().equals(userId) && !isAdmin(currentUser)) {
            throw new RuntimeException("You can only update your own account!");
        }

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername());
        }

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRoleName() != null && !request.getRoleName().isBlank()) {
            Role newRole = roleRepository.findByName(request.getRoleName())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRoleName()));
            user.setRole(newRole);
        }

        return userRepository.save(user);
    }

    // 5️⃣ Delete user (Admins only, cannot delete last admin)
    public void deleteUser(Long userId) {
        User user = getUser(userId);

        // 🔹 Ensure there is at least one admin remaining
        if ("ADMIN".equals(user.getRole().getName()) &&
                userRepository.findByRoleName("ADMIN").size() <= 1) {
            throw new RuntimeException("Cannot delete the last admin.");
        }

        userRepository.deleteById(userId);
    }

    // 🔹 Utility: Check if the user is an admin
    private boolean isAdmin(UserPrincipal user) {
        return user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
