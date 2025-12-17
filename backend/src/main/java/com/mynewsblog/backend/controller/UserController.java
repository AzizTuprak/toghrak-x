package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.dto.CreateUserRequest;
import com.mynewsblog.backend.dto.UpdateUserRequest;
import com.mynewsblog.backend.dto.UserResponseAdminDTO;
import com.mynewsblog.backend.dto.UserResponseDTO;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.security.UserPrincipal;
import com.mynewsblog.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1️⃣ Admin can create a new user (Editor/Admin)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseAdminDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        User newUser = userService.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getRoleName());
        // Only admins can create users, so we return the admin DTO.
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToAdminDTO(newUser));
    }

    // 2️⃣ Get all users (Admins only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserResponseAdminDTO> getAllUsers() {
        return userService.getAllUsers().stream()
                .map(this::mapToAdminDTO)
                .toList();
    }

    // 3️⃣ Get user profile (Only authenticated user can see their own info)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(java.util.Map.of("error", "unauthorized"));
        }
        User user = userService.getUser(currentUser.getId());
        if (isAdmin(currentUser)) {
            return ResponseEntity.ok(mapToAdminDTO(user));
        } else {
            return ResponseEntity.ok(mapToUserDTO(user));
        }
    }

    // 4️⃣ Admins can get any user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponseAdminDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(mapToAdminDTO(userService.getUser(id)));
    }

    // 5️⃣ Update user (Users can update their own profile, Admins can update any
    // user)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        User updatedUser = userService.updateUser(id, currentUser, request);
        if (isAdmin(currentUser)) {
            return ResponseEntity.ok(mapToAdminDTO(updatedUser));
        } else {
            return ResponseEntity.ok(mapToUserDTO(updatedUser));
        }
    }

    // 6️⃣ Delete user (Admins can delete users, but cannot delete the last admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // --- Helper Methods for DTO mapping ---

    private boolean isAdmin(UserPrincipal currentUser) {
        return currentUser.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }

    private UserResponseAdminDTO mapToAdminDTO(User user) {
        UserResponseAdminDTO dto = new UserResponseAdminDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        // Include role info for admin users
        dto.setRoleName(user.getRole().getName());
        return dto;
    }

    private UserResponseDTO mapToUserDTO(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoleName(user.getRole() != null ? user.getRole().getName() : null);
        return dto;
    }
}
