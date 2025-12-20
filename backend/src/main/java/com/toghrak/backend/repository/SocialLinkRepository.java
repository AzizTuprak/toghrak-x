package com.toghrak.backend.repository;

import com.toghrak.backend.model.SocialLink;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialLinkRepository extends JpaRepository<SocialLink, Long> {
    java.util.List<SocialLink> findTop10ByLabelContainingIgnoreCase(String label);
}
