
package com.mynewsblog.backend.dto;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter

public class UpdatePostRequest {
    private Long requestUserId;
    private String title;
    private String content;
    private Long categoryId;

    // getters & setters
    public UpdatePostRequest() {

    }
}