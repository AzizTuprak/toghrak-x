package com.mynewsblog.backend.dto;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {
    private String username;
    private String email;
    private String password;
    private String roleName;

    public UpdateUserRequest() {
    }

}