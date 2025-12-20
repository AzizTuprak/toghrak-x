package com.toghrak.backend.controller;

import com.toghrak.backend.service.SearchService;
import com.toghrak.backend.dto.SearchResultItem;
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
    public ResponseEntity<List<SearchResultItem>> search(@RequestParam(name = "q", required = false) String q) {
        return ResponseEntity.ok(searchService.search(q));
    }
}
