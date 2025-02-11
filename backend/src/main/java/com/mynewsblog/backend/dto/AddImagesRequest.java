package com.mynewsblog.backend.dto;
import java.util.List;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public class AddImagesRequest {
    private List<String> imageUrls;

    // getters & setters
    public AddImagesRequest() {

    }
}