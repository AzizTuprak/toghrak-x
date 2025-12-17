package com.mynewsblog.backend.service.command;

public class UpdateUserCommand {
    private final String username;
    private final String email;
    private final String password;
    private final String roleName;

    public UpdateUserCommand(String username, String email, String password, String roleName) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roleName = roleName;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRoleName() {
        return roleName;
    }
}
