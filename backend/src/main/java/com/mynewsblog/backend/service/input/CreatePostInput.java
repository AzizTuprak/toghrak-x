package com.mynewsblog.backend.service.input;

import java.util.List;

public class CreatePostInput {
    private final String title;
    private final String content;
    private final Long categoryId;
    private final String coverImage;
    private final List<String> imageUrls;

    public CreatePostInput(String title, String content, Long categoryId, String coverImage, List<String> imageUrls) {
        this.title = title;
        this.content = content;
        this.categoryId = categoryId;
        this.coverImage = coverImage;
        this.imageUrls = imageUrls;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }
}
