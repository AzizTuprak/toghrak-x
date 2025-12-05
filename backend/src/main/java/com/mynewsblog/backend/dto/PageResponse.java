package com.mynewsblog.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class PageResponse {
    private String slug;
    private String title;
    private String content;
    private LocalDateTime updatedAt;
}
