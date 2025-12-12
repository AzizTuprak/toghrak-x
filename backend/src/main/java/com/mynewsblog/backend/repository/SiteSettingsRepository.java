package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.SiteSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SiteSettingsRepository extends JpaRepository<SiteSettings, Long> {
    Optional<SiteSettings> findTopByOrderByIdAsc();
}
