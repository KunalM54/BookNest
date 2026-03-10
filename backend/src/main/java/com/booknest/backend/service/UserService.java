package com.booknest.backend.service;

import com.booknest.backend.dto.AuthResponse;
import com.booknest.backend.dto.LoginRequest;
import com.booknest.backend.dto.RegisterRequest;
import com.booknest.backend.model.User;
import com.booknest.backend.repository.UserRepository;
import com.booknest.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Admin credentials (hardcoded for demo)
    private static final String ADMIN_EMAIL = "admin@booknest.com";
    private static final String ADMIN_PASSWORD = "admin123";

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

    public AuthResponse login(LoginRequest request) {
        // Validate input
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return new AuthResponse("Email is required", false);
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return new AuthResponse("Password is required", false);
        }

        // Check for admin login
        if (request.getEmail().equals(ADMIN_EMAIL) && request.getPassword().equals(ADMIN_PASSWORD)) {
            String token = jwtUtil.generateToken(ADMIN_EMAIL, "ADMIN");
            
            // Get or create admin user in database to get ID
            User adminUser = userRepository.findByEmail(ADMIN_EMAIL).orElse(null);
            if (adminUser == null) {
                // Create admin user in database
                adminUser = new User();
                adminUser.setFullName("Administrator");
                adminUser.setStudentId("ADMIN001");
                adminUser.setEmail(ADMIN_EMAIL);
                adminUser.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
                adminUser.setRole(User.Role.ADMIN);
                adminUser.setActive(true);
                adminUser = userRepository.save(adminUser);
            }
            Long adminId = adminUser.getId();
            return new AuthResponse("Login successful", true, token, adminId, "Administrator", ADMIN_EMAIL, "ADMIN");
        }

        // Check if user exists
        var userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty()) {
            return new AuthResponse("Invalid email or password", false);
        }
        
        User user = userOpt.get();

        // Verify password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse("Invalid email or password", false);
        }

        // Generate token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse("Login successful", true, token, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
    }

    // Helper method to encode password
    public static String encodePassword(String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    // Helper method to verify password
    public boolean verifyPassword(User user, String rawPassword) {
        if (user.getPassword() == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    // Get encoded admin password for verification
    public static String getAdminEncodedPassword(String rawPassword) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(rawPassword);
    }
}

