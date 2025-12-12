package com.mynewsblog.backend.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final long WINDOW_MS = 60_000;

    private record Limit(int maxRequests) {}

    private static class Counter {
        AtomicInteger count = new AtomicInteger(0);
        long windowStart = System.currentTimeMillis();
    }

    private final ConcurrentHashMap<String, Counter> counters = new ConcurrentHashMap<>();
    private final Map<String, Limit> limits = Map.of(
            "/api/search", new Limit(30),
            "/api/posts/popular", new Limit(30),
            "/api/auth/login", new Limit(10)
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        // Apply to public, potentially abused endpoints
        return !limits.containsKey(path);
    }

    @Override
    protected void doFilterInternal(@org.springframework.lang.NonNull HttpServletRequest request,
                                    @org.springframework.lang.NonNull HttpServletResponse response,
                                    @org.springframework.lang.NonNull FilterChain filterChain)
            throws ServletException, IOException {

        String key = resolveKey(request);
        Counter counter = counters.computeIfAbsent(key, k -> new Counter());
        int max = limits.getOrDefault(request.getRequestURI(), new Limit(30)).maxRequests();
        long now = System.currentTimeMillis();
        synchronized (counter) {
            if (now - counter.windowStart > WINDOW_MS) {
                counter.count.set(0);
                counter.windowStart = now;
            }
            if (counter.count.incrementAndGet() > max) {
                response.setStatus(429);
                response.getWriter().write("Too Many Requests");
                return;
            }
        }
        filterChain.doFilter(request, response);
    }

    private String resolveKey(HttpServletRequest request) {
        String ip = request.getRemoteAddr();
        return ip == null ? "unknown" : ip;
    }
}
