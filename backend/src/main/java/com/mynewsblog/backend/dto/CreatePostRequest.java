package com.mynewsblog.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreatePostRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    // Optional cover image URL returned by the image upload endpoint
    private String coverImage;

//    // Optional list of image URLs
//    private List<String> imageUrls;

//    public CreatePostRequest() {
//    }
}
