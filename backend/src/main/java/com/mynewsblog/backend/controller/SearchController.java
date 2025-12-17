package com.mynewsblog.backend.controller;

import com.mynewsblog.backend.dto.SearchResult;
import com.mynewsblog.backend.service.SearchService;
import com.mynewsblog.backend.service.result.SearchHit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/api/search")
    public ResponseEntity<List<SearchResult>> search(@RequestParam(name = "q", required = false) String q) {
        List<SearchResult> out = searchService.search(q).stream().map(this::toDto).toList();
        return ResponseEntity.ok(out);
    }

    private SearchResult toDto(SearchHit hit) {
        SearchResult r = new SearchResult();
        r.setType(hit.getType());
        r.setTitle(hit.getTitle());
        r.setUrl(hit.getUrl());
        r.setSnippet(hit.getSnippet());
        return r;
    }
}
