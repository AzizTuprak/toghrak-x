package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.dto.CreateUserRequest;
import com.mynewsblog.backend.dto.UpdateUserRequest;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.security.UserPrincipal;
import com.mynewsblog.backend.service.UserService;
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
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        User newUser = userService.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getRoleName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    // 2️⃣ Get all users (Admins only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // 3️⃣ Get user profile (Only authenticated user can see their own info)
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        return ResponseEntity.ok(userService.getUser(currentUser.getId()));
    }

    // 4️⃣ Admins can get any user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUser(id));
    }

    // 5️⃣ Update user (Users can update their own profile, Admins can update any user)
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser
    ) {
        User updatedUser = userService.updateUser(id, currentUser, request);
        return ResponseEntity.ok(updatedUser);
    }

    // 6️⃣ Delete user (Admins can delete users, but cannot delete the last admin)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
