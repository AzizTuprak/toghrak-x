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
    private Long categoryId;  // No need for authorId since we get it from `UserPrincipal`

    public CreatePostRequest() {
    }
}
