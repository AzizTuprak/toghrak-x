package com.mynewsblog.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchResult {
    private String type;   // POST, PAGE, SOCIAL
    private String title;
    private String url;
    private String snippet;
}
