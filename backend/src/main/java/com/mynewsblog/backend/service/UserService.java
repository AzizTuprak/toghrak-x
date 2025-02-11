package com.mynewsblog.backend.service;

import com.mynewsblog.backend.exception.UsernameAlreadyExistsException;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.model.Role;
import com.mynewsblog.backend.repository.UserRepository;
import com.mynewsblog.backend.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public UserService(UserRepository userRepository, RoleRepository roleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
    }

    // 1) Create user (e.g., new Editor)
    public User createUser(String username, String email, String password, String roleName) {
        // Check if username is already taken
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists!");
        }

        // Find role by name => "ADMIN" or "EDITOR"
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        // Build new user
        User user = User.builder()
                .username(username)
                .email(email)
                .password(password)  // In real apps, we should hash the password!
                .role(role)
                .build();

        return userRepository.save(user);
    }

    // 2) Find user by ID
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // 3) List all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // 4) Update user's password or role
    public User updateUser(Long userId, String newUsername, String newPassword, String newRoleName) {
        User user = getUser(userId);

        if (newUsername != null && !newUsername.isBlank()) {
            // Optional: Check if name taken by another user
            user.setUsername(newUsername);
        }
        if (newPassword != null && !newPassword.isBlank()) {
            user.setPassword(newPassword);
        }
        if (newRoleName != null && !newRoleName.isBlank()) {
            Role newRole = roleRepository.findByName(newRoleName)
                    .orElseThrow(() -> new RuntimeException("Role not found: " + newRoleName));
            user.setRole(newRole);
        }
        return userRepository.save(user);
    }

    // 5) Delete user
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}