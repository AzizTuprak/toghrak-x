package com.mynewsblog.backend.dto;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class CreateUserRequest {
    private String username;
    private String email;
    private String password;
    private String roleName;

    // Constructors (if you use Lombok, you can skip or use @Data)
    public CreateUserRequest() {
    }

}