package com.booknest.backend.service;

import com.booknest.backend.dto.AuthResponse;
import com.booknest.backend.dto.RegisterRequest;
import com.booknest.backend.model.User;
import com.booknest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest request) {
        // Validate input
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            return new AuthResponse("Full name is required", false);
        }

        if (request.getSID() == null || request.getSID().trim().isEmpty()) {
            return new AuthResponse("Student ID is required", false);
        }

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse("Email is required", false);
        }

        if (request.getPassword() == null || request.getPassword().length() < 6) {
            return new AuthResponse("Password must be at least 6 characters", false);
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            return new AuthResponse("Passwords do not match", false);
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse("Email already registered", false);
        }

        // Check if student ID already exists
        if (userRepository.existsByStudentId(request.getSID())) {
            return new AuthResponse("Student ID already registered", false);
        }

        // Create new user
        User user = new User();
        user.setFullName(request.getFullName());
        user.setStudentId(request.getSID());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(User.Role.STUDENT);

        // Save user
        userRepository.save(user);

        return new AuthResponse("Registration successful", true);
    }
}

