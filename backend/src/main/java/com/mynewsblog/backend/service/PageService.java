package com.mynewsblog.backend.service;

import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.model.Page;
import com.mynewsblog.backend.repository.PageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.Objects;
import java.util.ArrayList;

@Service
@Transactional
public class PageService {

    private final PageRepository pageRepository;

    public PageService(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    @Transactional
    public Page create(String slug, String title, String content, List<String> images) {
        Page page = Page.builder()
                .slug(slug)
                .title(title)
                .content(sanitize(content))
                .images(cleanImages(images))
                .build();
        return pageRepository.save(page);
    }

    @Transactional
    public Page update(String slug, String newSlug, String title, String content, List<String> images) {
        Page existing = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + slug));
        existing.setSlug(newSlug);
        existing.setTitle(title);
        existing.setContent(sanitize(content));
        existing.setImages(cleanImages(images));
        return pageRepository.save(existing);
    }

    @Transactional
    public void delete(String slug) {
        Page existing = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + slug));
        pageRepository.delete(existing);
    }

    @Transactional(readOnly = true)
    public Page getBySlug(String slug) {
        return pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + slug));
    }

    @Transactional(readOnly = true)
    public List<Page> list() {
        return pageRepository.findAll();
    }

    private String sanitize(String html) {
        return html == null ? "" : HtmlUtils.htmlEscape(html);
    }

    private List<String> cleanImages(List<String> images) {
        if (images == null) return new ArrayList<>();
        var list = images.stream()
                .filter(Objects::nonNull)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        return new ArrayList<>(list);
    }
}
