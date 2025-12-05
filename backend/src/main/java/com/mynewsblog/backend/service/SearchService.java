package com.mynewsblog.backend.service;

import com.mynewsblog.backend.dto.SearchResult;
import com.mynewsblog.backend.model.Page;
import com.mynewsblog.backend.model.Post;
import com.mynewsblog.backend.model.SocialLink;
import com.mynewsblog.backend.repository.PageRepository;
import com.mynewsblog.backend.repository.PostRepository;
import com.mynewsblog.backend.repository.SocialLinkRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchService {

    private final PostRepository postRepository;
    private final PageRepository pageRepository;
    private final SocialLinkRepository socialLinkRepository;

    public SearchService(PostRepository postRepository, PageRepository pageRepository, SocialLinkRepository socialLinkRepository) {
        this.postRepository = postRepository;
        this.pageRepository = pageRepository;
        this.socialLinkRepository = socialLinkRepository;
    }

    public List<SearchResult> search(String q) {
        if (q == null || q.isBlank()) {
            return List.of();
        }
        String term = q.trim();
        List<SearchResult> results = new ArrayList<>();

        List<Post> posts = postRepository.searchTop10(term);
        posts.forEach(p -> {
            SearchResult r = new SearchResult();
            r.setType("POST");
            r.setTitle(p.getTitle());
            r.setUrl("/posts/" + p.getId());
            r.setSnippet(snippet(p.getContent(), term));
            results.add(r);
        });

        List<Page> pages = pageRepository.searchTop10(term);
        pages.forEach(p -> {
            SearchResult r = new SearchResult();
            r.setType("PAGE");
            r.setTitle(p.getTitle());
            r.setUrl("/page/" + p.getSlug());
            r.setSnippet(snippet(p.getContent(), term));
            results.add(r);
        });

        List<SocialLink> socials = socialLinkRepository.findTop10ByLabelContainingIgnoreCase(term);
        socials.forEach(s -> {
            SearchResult r = new SearchResult();
            r.setType("SOCIAL");
            r.setTitle(s.getLabel());
            r.setUrl(s.getUrl());
            r.setSnippet(s.getUrl());
            results.add(r);
        });

        return results;
    }

    private String snippet(String content, String term) {
        if (content == null) return "";
        String lower = content.toLowerCase();
        int idx = lower.indexOf(term.toLowerCase());
        if (idx < 0) {
            return content.length() > 140 ? content.substring(0, 140) + "..." : content;
        }
        int start = Math.max(0, idx - 40);
        int end = Math.min(content.length(), idx + term.length() + 60);
        String snip = content.substring(start, end);
        if (start > 0) snip = "..." + snip;
        if (end < content.length()) snip = snip + "...";
        return snip;
    }
}
