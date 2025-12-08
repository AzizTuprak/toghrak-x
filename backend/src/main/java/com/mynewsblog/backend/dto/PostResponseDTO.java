package com.mynewsblog.backend.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
public class PostResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String coverImage;
    private Long categoryId;
    private String categoryName;
    private String authorUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long viewCount;
    private List<String> imageUrls;
    // ... any other fields you want to expose
}
