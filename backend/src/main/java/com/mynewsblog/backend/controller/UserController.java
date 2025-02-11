package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.mynewsblog.backend.dto.CreateUserRequest;
import com.mynewsblog.backend.dto.UpdateUserRequest;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    // We inject the service via constructor
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // 1) Create user (e.g., editor)
    // Example JSON body:
    // {
    //   "username": "editorBob",
    //   "email": "editor1@gmail.comb",
    //   "password": "secret123",
    //   "roleName": "EDITOR"
    // }
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody CreateUserRequest request) {
        // This request is a simple DTO we define
        User newUser = userService.createUser(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getRoleName()  // "EDITOR" or "ADMIN"
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    // 2) List all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // 3) Find user by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUser(id);
    }

    // 4) Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {
        User updated = userService.updateUser(
                id,
                request.getUsername(),
                request.getPassword(),
                request.getRoleName()
        );
        return ResponseEntity.ok(updated);
    }

    // 5) Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}