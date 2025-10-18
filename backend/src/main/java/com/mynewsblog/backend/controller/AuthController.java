package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.dto.LoginRequest;
import com.mynewsblog.backend.dto.LoginResponse;
import com.mynewsblog.backend.security.JwtUtil;
import com.mynewsblog.backend.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Create authentication token
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );
        // If authentication was successful, generate a JWT token
        String token = jwtUtil.generateToken(authentication);

        // You can include additional info if needed, here we return just the token
        LoginResponse response = new LoginResponse(token);
        return ResponseEntity.ok(response);
    }
}
