package com.mynewsblog.backend.repository;

import com.mynewsblog.backend.model.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    java.util.List<SocialLink> findTop10ByLabelContainingIgnoreCase(String label);
}
