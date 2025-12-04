package com.mynewsblog.backend.service;

import com.mynewsblog.backend.dto.UpdateUserRequest;
import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.exception.UsernameAlreadyExistsException;
import com.mynewsblog.backend.model.Role;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.repository.RoleRepository;
import com.mynewsblog.backend.repository.UserRepository;
import com.mynewsblog.backend.repository.PostRepository;
import com.mynewsblog.backend.security.UserPrincipal;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.dao.DataIntegrityViolationException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            RoleRepository roleRepository, PostRepository postRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.postRepository = postRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1️⃣ Create user (Editor/Admin)
    public User createUser(String username, String email, String password, String roleName) {
        // Check for duplicate username
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UsernameAlreadyExistsException("Username already exists!");
        }

        // Retrieve role by name or throw an exception if not found
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + roleName));

        // Build and save the new user with hashed password
        User user = User.builder()
                .username(username)
                .email(email)
                .password(passwordEncoder.encode(password))
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

    // 4️⃣ Update user (Users can update their own profile, Admins can update any
    // user)
    public User updateUser(Long userId, UserPrincipal currentUser, UpdateUserRequest request) {
        // Fetch the existing user
        User user = getUser(userId);

        // Ensure that only the user themselves or an admin can update
        if (!currentUser.getId().equals(userId) && !isAdmin(currentUser)) {
            throw new AccessDeniedException("You can only update your own account!");
        }

        // Update username if provided and different
        String newUsername = request.getUsername();
        if (newUsername != null && !newUsername.isBlank() && !newUsername.equals(user.getUsername())) {
            if (userRepository.findByUsername(newUsername).isPresent()) {
                throw new UsernameAlreadyExistsException("Username already exists!");
            }
            user.setUsername(newUsername);
        }

        // Update password if provided (after encoding)
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        // Update email if provided and check uniqueness
        String newEmail = request.getEmail();
        if (newEmail != null && !newEmail.isBlank() && !newEmail.equals(user.getEmail())) {
            if (userRepository.findByEmail(newEmail).isPresent()) {
                throw new RuntimeException("Email already exists!");
            }
            user.setEmail(newEmail);
        }

        // Update role only if current user is admin
        if (isAdmin(currentUser)) {
            if (request.getRoleName() != null && !request.getRoleName().isBlank()) {
                Role newRole = roleRepository.findByName(request.getRoleName())
                        .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRoleName()));
                user.setRole(newRole);
            }
        } else {
            // Non-admin users are not allowed to update their role.
            if (request.getRoleName() != null) {
                throw new AccessDeniedException("You cannot change your role.");
            }
        }

        // Update the timestamp and save
        user.setUpdatedAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    // 5️⃣ Delete user (Admins only, cannot delete the last admin)
    public void deleteUser(Long userId) {
        User user = getUser(userId);

        // Ensure there is at least one admin remaining
        if ("ADMIN".equals(user.getRole().getName()) &&
                userRepository.findByRole_Name("ADMIN").size() <= 1) {
            throw new AccessDeniedException("Cannot delete the last admin.");
        }

        // block if the user owns posts
        if (postRepository.existsByAuthorId(userId)) {
            long n = postRepository.countByAuthorId(userId);
            throw new DataIntegrityViolationException(
                    "Cannot delete user: they still own " + n + " post(s). " +
                            "Delete or transfer their posts first.");
        }

        userRepository.deleteById(userId);
    }

    // Utility: Check if the current user has admin privileges
    private boolean isAdmin(UserPrincipal user) {
        return user.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }
}
