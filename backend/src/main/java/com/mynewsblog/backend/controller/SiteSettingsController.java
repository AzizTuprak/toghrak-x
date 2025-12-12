package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.dto.SiteSettingsDto;
import com.mynewsblog.backend.service.SiteSettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/site-settings")
public class SiteSettingsController {

    private final SiteSettingsService service;

    public SiteSettingsController(SiteSettingsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<SiteSettingsDto> get() {
        return ResponseEntity.ok(service.get());
    }

    @PutMapping
    public ResponseEntity<SiteSettingsDto> update(@Valid @RequestBody SiteSettingsDto dto) {
        return ResponseEntity.ok(service.update(dto));
    }
}
