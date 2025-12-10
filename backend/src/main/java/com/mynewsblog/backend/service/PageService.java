package com.mynewsblog.backend.service;

import com.mynewsblog.backend.dto.UpsertPageRequest;
import com.mynewsblog.backend.exception.ResourceNotFoundException;
import com.mynewsblog.backend.model.Page;
import com.mynewsblog.backend.repository.PageRepository;
import org.springframework.web.util.HtmlUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PageService {

    private final PageRepository pageRepository;

    public PageService(PageRepository pageRepository) {
        this.pageRepository = pageRepository;
    }

    public Page create(UpsertPageRequest request) {
        Page page = Page.builder()
                .slug(request.getSlug())
                .title(request.getTitle())
                .content(sanitize(request.getContent()))
                .build();
        return pageRepository.save(page);
    }

    public Page update(String slug, UpsertPageRequest request) {
        Page existing = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + slug));
        existing.setSlug(request.getSlug());
        existing.setTitle(request.getTitle());
        existing.setContent(sanitize(request.getContent()));
        return pageRepository.save(existing);
    }

    public void delete(String slug) {
        Page existing = pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + slug));
        pageRepository.delete(existing);
    }

    public Page getBySlug(String slug) {
        return pageRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page not found: " + slug));
    }

    public List<Page> list() {
        return pageRepository.findAll();
    }

    private String sanitize(String html) {
        return html == null ? "" : HtmlUtils.htmlEscape(html);
    }
}
