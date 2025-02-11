package com.mynewsblog.backend.exception;

public class UsernameAlreadyExistsException extends RuntimeException{
    public UsernameAlreadyExistsException(String message) {
        super(message);
    }

    public Throwable getRootCause() {
        Throwable cause = this.getCause();
        return (cause != null) ? cause : this; // Return the cause if available, otherwise return itself
    }
}