package com.mynewsblog.backend.service.result;

public class SearchHit {
    private final String type;
    private final String title;
    private final String url;
    private final String snippet;

    public SearchHit(String type, String title, String url, String snippet) {
        this.type = type;
        this.title = title;
        this.url = url;
        this.snippet = snippet;
    }

    public String getType() {
        return type;
    }

    public String getTitle() {
        return title;
    }

    public String getUrl() {
        return url;
    }

    public String getSnippet() {
        return snippet;
    }
}
