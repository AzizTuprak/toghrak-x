package com.mynewsblog.backend.service;

import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.model.RefreshToken;
import com.mynewsblog.backend.model.User;
import com.mynewsblog.backend.repository.RefreshTokenRepository;
import com.mynewsblog.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Service
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final long refreshTtlMs;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            @Value("${app.refresh.expiration:43200000}") long refreshTtlMs) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.refreshTtlMs = refreshTtlMs;
    }

    public RefreshToken create(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        String raw = UUID.randomUUID().toString();
        RefreshToken token = RefreshToken.builder()
                .token(hash(raw))
                .user(user)
                .expiresAt(LocalDateTime.now().plusNanos(refreshTtlMs * 1_000_000))
                .revoked(false)
                .build();
        token.setPlainToken(raw);
        return refreshTokenRepository.save(token);
    }

    public RefreshToken rotate(String tokenValue) {
        RefreshToken existing = refreshTokenRepository.findByToken(hash(tokenValue))
                .orElseThrow(() -> new ResourceNotFoundException("Invalid refresh token"));
        validate(existing);
        existing.setRevoked(true);
        refreshTokenRepository.save(existing);
        return create(existing.getUser().getId());
    }

    public void revoke(String tokenValue) {
        refreshTokenRepository.findByToken(hash(tokenValue)).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    private void validate(RefreshToken token) {
        if (token.isRevoked()) {
            throw new ResourceNotFoundException("Refresh token revoked");
        }
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResourceNotFoundException("Refresh token expired");
        }
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(token.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }
}
