package com.mynewsblog.backend.service;

import com.mynewsblog.backend.dto.SocialLinkDto;
import com.mynewsblog.backend.model.SocialLink;
import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.repository.SocialLinkRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SocialLinkService {

    private final SocialLinkRepository repo;

    public SocialLinkService(SocialLinkRepository repo) {
        this.repo = repo;
    }

    public List<SocialLink> list() {
        return repo.findAll();
    }

    public SocialLink create(SocialLinkDto dto) {
        SocialLink link = SocialLink.builder()
                .label(dto.getLabel())
                .url(dto.getUrl())
                .icon(dto.getIcon())
                .build();
        return repo.save(link);
    }

    public SocialLink update(Long id, SocialLinkDto dto) {
        SocialLink existing = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Social link not found: " + id));
        existing.setLabel(dto.getLabel());
        existing.setUrl(dto.getUrl());
        existing.setIcon(dto.getIcon());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
