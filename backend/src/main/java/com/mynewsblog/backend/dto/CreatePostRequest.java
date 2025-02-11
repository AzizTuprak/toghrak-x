package com.mynewsblog.backend.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public class CreatePostRequest {
    private String title;
    private String content;
    private Long authorId;
    private Long categoryId;

    // getters & setters
    public CreatePostRequest(){

    }
}