package com.mynewsblog.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpsertPageRequest {

    @NotBlank(message = "Slug is required")
    private String slug;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;
}
