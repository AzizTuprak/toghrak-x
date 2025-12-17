package com.mynewsblog.backend.service;

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
    public SiteSettings update(String title, String logoUrl, String slogan) {
        SiteSettings settings = repository.findTopByOrderByIdAsc().orElseGet(SiteSettings::new);
        settings.setTitle(title);
        settings.setLogoUrl(logoUrl);
        settings.setSlogan(slogan);
        return repository.save(settings);
    }

    @Transactional
    public SiteSettings get() {
        SiteSettings settings = repository.findTopByOrderByIdAsc()
                .orElseGet(() -> repository.save(new SiteSettings()));
        return settings;
    }
}
