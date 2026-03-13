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

import java.util.Locale;
import java.util.regex.Pattern;

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
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    private static final Pattern FULL_NAME_PATTERN = Pattern.compile("^[A-Za-z]+(?:[ '-][A-Za-z]+)*$");
    private static final Pattern STUDENT_ID_PATTERN = Pattern.compile("^S\\d{4,10}$");
    private static final Pattern STRONG_PASSWORD_PATTERN = Pattern.compile(
            "^(?=\\S{6,64}$)(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$"
    );

    public AuthResponse register(RegisterRequest request) {
        String fullName = normalizeFullName(request.getFullName());
        String studentId = normalizeStudentId(request.getSID());
        String email = normalizeEmail(request.getEmail());
        String password = request.getPassword() == null ? "" : request.getPassword();
        String confirmPassword = request.getConfirmPassword() == null ? "" : request.getConfirmPassword();

        if (fullName.isEmpty()) {
            return new AuthResponse("Full name is required", false);
        }

        if (!FULL_NAME_PATTERN.matcher(fullName).matches()) {
            return new AuthResponse("Full name can contain letters, spaces, apostrophes, and hyphens only", false);
        }

        if (studentId.isEmpty()) {
            return new AuthResponse("Student ID is required", false);
        }

        if (!STUDENT_ID_PATTERN.matcher(studentId).matches()) {
            return new AuthResponse("Student ID must start with S and contain 4 to 10 digits", false);
        }

        if (email.isEmpty()) {
            return new AuthResponse("Email is required", false);
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return new AuthResponse("Please enter a valid email address", false);
        }

        if (!STRONG_PASSWORD_PATTERN.matcher(password).matches()) {
            return new AuthResponse(
                    "Password must be 6 to 64 characters and include uppercase, lowercase, and number",
                    false
            );
        }

        if (!password.equals(confirmPassword)) {
            return new AuthResponse("Passwords do not match", false);
        }

        // Check if email already exists
        if (userRepository.existsByEmail(email)) {
            return new AuthResponse("Email already registered", false);
        }

        // Check if student ID already exists
        if (userRepository.existsByStudentId(studentId)) {
            return new AuthResponse("Student ID already registered", false);
        }

        // Create new user
        User user = new User();
        user.setFullName(fullName);
        user.setStudentId(studentId);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.STUDENT);
        user.setActive(true);

        // Save user
        userRepository.save(user);

        return new AuthResponse("Registration successful", true);
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.getEmail());
        String password = request.getPassword() == null ? "" : request.getPassword();

        if (email.isEmpty()) {
            return new AuthResponse("Email is required", false);
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return new AuthResponse("Please enter a valid email address", false);
        }

        if (password.trim().isEmpty()) {
            return new AuthResponse("Password is required", false);
        }

        // Check for admin login
        if (email.equals(ADMIN_EMAIL) && password.equals(ADMIN_PASSWORD)) {
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
        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return new AuthResponse("Invalid email or password", false);
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            return new AuthResponse("Your account is blocked. Please contact the administrator.", false);
        }

        // Verify password
        if (!passwordEncoder.matches(password, user.getPassword())) {
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

    private String normalizeFullName(String fullName) {
        if (fullName == null) {
            return "";
        }

        return fullName.trim().replaceAll("\\s+", " ");
    }

    private String normalizeStudentId(String studentId) {
        if (studentId == null) {
            return "";
        }

        return studentId.trim().toUpperCase(Locale.ROOT);
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            return "";
        }

        return email.trim().toLowerCase(Locale.ROOT);
    }
}

