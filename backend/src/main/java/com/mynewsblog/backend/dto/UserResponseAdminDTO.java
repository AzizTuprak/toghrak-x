package com.mynewsblog.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponseAdminDTO {
    private Long id;
    private String username;
    private String email;
    private String roleName; // Only admins see this.
}
