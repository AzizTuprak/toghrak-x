package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.dto.LoginRequest;
import com.mynewsblog.backend.dto.LoginResponse;
import com.mynewsblog.backend.security.JwtUtil;
import com.mynewsblog.backend.security.UserPrincipal;
import com.mynewsblog.backend.service.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

        private final AuthenticationManager authenticationManager;
        private final JwtUtil jwtUtil;
        private final RefreshTokenService refreshTokenService;
        private final long refreshExpiryMs;
        private final boolean secureCookie;
        private final String cookieDomain;

        @Autowired
        public AuthController(AuthenticationManager authenticationManager,
                        JwtUtil jwtUtil,
                        RefreshTokenService refreshTokenService,
                        @Value("${app.refresh.expiration:43200000}") long refreshExpiryMs,
                        @Value("${app.refresh.cookie.secure:false}") boolean secureCookie,
                        @Value("${app.refresh.cookie.domain:}") String cookieDomain) {
                this.authenticationManager = authenticationManager;
                this.jwtUtil = jwtUtil;
                this.refreshTokenService = refreshTokenService;
                this.refreshExpiryMs = refreshExpiryMs;
                this.secureCookie = secureCookie;
                this.cookieDomain = cookieDomain;
        }

        @PostMapping("/login")
        public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
                // Create authentication token
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                loginRequest.getUsername(),
                                                loginRequest.getPassword()));
                // If authentication was successful, generate a JWT token
                String token = jwtUtil.generateToken(authentication);

                // Issue refresh token cookie
                Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        var refresh = refreshTokenService.create(userId);
        ResponseCookie cookie = buildRefreshCookie(refresh.getPlainToken(), refreshExpiryMs);

                return ResponseEntity.ok()
                                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                                .body(new LoginResponse(token));
        }

        @PostMapping("/refresh")
        public ResponseEntity<LoginResponse> refresh(
                        @CookieValue(name = "refreshToken", required = false) String refreshToken) {
                if (refreshToken == null || refreshToken.isBlank()) {
                        return ResponseEntity.status(401).build();
                }
        var rotated = refreshTokenService.rotate(refreshToken);
        String newAccess = jwtUtil.generateTokenFromUserId(rotated.getUser().getId());
        ResponseCookie cookie = buildRefreshCookie(rotated.getPlainToken(), refreshExpiryMs);
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new LoginResponse(newAccess));
    }

        @PostMapping("/logout")
        public ResponseEntity<Void> logout(
                        @CookieValue(name = "refreshToken", required = false) String refreshToken) {
                if (refreshToken != null && !refreshToken.isBlank()) {
                        refreshTokenService.revoke(refreshToken);
                }
                ResponseCookie cleared = ResponseCookie.from("refreshToken", "")
                                .httpOnly(true)
                                .secure(secureCookie)
                                .sameSite("Lax")
                                .path("/api/auth/refresh")
                                .maxAge(0)
                                .domain(cookieDomain.isBlank() ? null : cookieDomain)
                                .build();
                return ResponseEntity.noContent()
                                .header(HttpHeaders.SET_COOKIE, cleared.toString())
                                .build();
        }

        private ResponseCookie buildRefreshCookie(String value, long ttlMs) {
                return ResponseCookie.from("refreshToken", value)
                                .httpOnly(true)
                                .secure(secureCookie)
                                .sameSite("Lax")
                                .path("/api/auth/refresh")
                                .maxAge(ttlMs / 1000)
                                .domain(cookieDomain.isBlank() ? null : cookieDomain)
                                .build();
        }
}
