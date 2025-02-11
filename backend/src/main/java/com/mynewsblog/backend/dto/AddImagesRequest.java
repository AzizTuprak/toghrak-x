package com.mynewsblog.backend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class AddImagesRequest {

    @NotEmpty(message = "Image list cannot be empty")
    private List<String> imageUrls;

    public AddImagesRequest() {
    }
}
