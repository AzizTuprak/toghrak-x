package com.mynewsblog.backend.dto;
import jakarta.validation.constraints.Size;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserRequest {

    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    private String roleName; // Optional, only for admins

    public UpdateUserRequest() {
    }

}