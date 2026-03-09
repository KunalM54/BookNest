package com.booknest.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String message;
    private boolean success;
    private String token;
    private String fullName;
    private String email;
    private String role;

    public AuthResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
}

