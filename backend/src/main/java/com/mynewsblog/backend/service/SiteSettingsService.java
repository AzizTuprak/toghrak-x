package com.mynewsblog.backend.service;

import com.mynewsblog.backend.dto.SiteSettingsDto;
import com.mynewsblog.backend.model.SiteSettings;
import com.mynewsblog.backend.repository.SiteSettingsRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class SiteSettingsService {

    private final SiteSettingsRepository repository;

    public SiteSettingsService(SiteSettingsRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public SiteSettingsDto update(SiteSettingsDto dto) {
        SiteSettings settings = repository.findTopByOrderByIdAsc().orElseGet(SiteSettings::new);
        settings.setTitle(dto.getTitle());
        settings.setLogoUrl(dto.getLogoUrl());
        settings.setSlogan(dto.getSlogan());
        SiteSettings saved = repository.save(settings);
        return toDto(saved);
    }

    @Transactional
    public SiteSettingsDto get() {
        SiteSettings settings = repository.findTopByOrderByIdAsc()
                .orElseGet(() -> repository.save(new SiteSettings()));
        return toDto(settings);
    }

    private SiteSettingsDto toDto(SiteSettings settings) {
        SiteSettingsDto dto = new SiteSettingsDto();
        dto.setId(settings.getId());
        dto.setTitle(settings.getTitle());
        dto.setLogoUrl(settings.getLogoUrl());
        dto.setSlogan(settings.getSlogan());
        return dto;
    }
}
