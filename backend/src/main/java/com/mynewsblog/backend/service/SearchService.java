package com.mynewsblog.backend.service;

import com.mynewsblog.backend.model.Page;
import com.mynewsblog.backend.model.Post;
import com.mynewsblog.backend.model.SocialLink;
import com.mynewsblog.backend.repository.PageRepository;
import com.mynewsblog.backend.repository.PostRepository;
import com.mynewsblog.backend.repository.SocialLinkRepository;
import com.mynewsblog.backend.service.result.SearchHit;
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

    public List<SearchHit> search(String q) {
        if (q == null || q.isBlank()) {
            return List.of();
        }
        String term = q.trim();
        List<SearchHit> results = new ArrayList<>();

        List<Post> posts = postRepository.searchTop10(term);
        posts.forEach(p -> {
            results.add(new SearchHit(
                    "POST",
                    p.getTitle(),
                    "/posts/" + p.getId(),
                    snippet(p.getContent(), term)
            ));
        });

        List<Page> pages = pageRepository.searchTop10(term);
        pages.forEach(p -> {
            results.add(new SearchHit(
                    "PAGE",
                    p.getTitle(),
                    "/page/" + p.getSlug(),
                    snippet(p.getContent(), term)
            ));
        });

        List<SocialLink> socials = socialLinkRepository.findTop10ByLabelContainingIgnoreCase(term);
        socials.forEach(s -> {
            results.add(new SearchHit(
                    "SOCIAL",
                    s.getLabel(),
                    s.getUrl(),
                    s.getUrl()
            ));
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
