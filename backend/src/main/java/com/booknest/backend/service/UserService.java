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
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Optional;
import java.util.regex.Pattern;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final SecureRandom random = new SecureRandom();

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
        String studentId = normalizeStudentId(request.getStudentId());
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

        if (userRepository.existsByEmail(email)) {
            return new AuthResponse("Email already registered", false);
        }

        if (userRepository.existsByStudentId(studentId)) {
            return new AuthResponse("Student ID already registered", false);
        }

        User user = new User();
        user.setFullName(fullName);
        user.setStudentId(studentId);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.STUDENT);
        user.setActive(true);

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

        if (email.equals(ADMIN_EMAIL) && password.equals(ADMIN_PASSWORD)) {
            String token = jwtUtil.generateToken(ADMIN_EMAIL, "ADMIN");
            
            User adminUser = userRepository.findByEmail(ADMIN_EMAIL).orElse(null);
            if (adminUser == null) {
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
            return new AuthResponse("Login successful", true, token, adminId, "Administrator", ADMIN_EMAIL, "ADMIN", "ADMIN001");
        }

        var userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            return new AuthResponse("Invalid email or password", false);
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            return new AuthResponse("Your account is blocked. Please contact the administrator.", false);
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return new AuthResponse("Invalid email or password", false);
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponse("Login successful", true, token, user.getId(), user.getFullName(), user.getEmail(), user.getRole().name(), user.getStudentId());
    }

    @Transactional
    public AuthResponse forgotPassword(String email) {
        String normalizedEmail = normalizeEmail(email);

        if (normalizedEmail.isEmpty()) {
            return new AuthResponse("Email is required", false);
        }

        if (!EMAIL_PATTERN.matcher(normalizedEmail).matches()) {
            return new AuthResponse("Please enter a valid email address", false);
        }

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            return new AuthResponse("Email not found", false);
        }

        User user = userOpt.get();

        String otp = generateOtp();
        LocalDateTime expiry = LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES);

        user.setOtp(otp);
        user.setOtpExpiry(expiry);
        userRepository.save(user);

        boolean emailSent = emailService.sendOtpEmail(normalizedEmail, otp);

        if (!emailSent) {
            logger.error("Failed to send OTP email to: {}", normalizedEmail);
            return new AuthResponse("Failed to send OTP. Please try again later.", false);
        }

        logger.info("OTP sent to: {} (OTP: {}, Expires: {})", normalizedEmail, otp, expiry);
        return new AuthResponse("OTP sent successfully. Please check your email.", true);
    }

    public AuthResponse verifyOtp(String email, String otp) {
        String normalizedEmail = normalizeEmail(email);

        if (normalizedEmail.isEmpty() || otp == null || otp.isEmpty()) {
            return new AuthResponse("Email and OTP are required", false);
        }

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            return new AuthResponse("Email not found", false);
        }

        User user = userOpt.get();

        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return new AuthResponse("No OTP found. Please request a new OTP.", false);
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            user.clearOtp();
            userRepository.save(user);
            return new AuthResponse("OTP has expired. Please request a new OTP.", false);
        }

        if (!user.getOtp().equals(otp.trim())) {
            return new AuthResponse("Invalid OTP. Please try again.", false);
        }

        return new AuthResponse("OTP verified successfully", true);
    }

    @Transactional
    public AuthResponse resetPassword(String email, String otp, String newPassword) {
        String normalizedEmail = normalizeEmail(email);

        if (normalizedEmail.isEmpty() || otp == null || otp.isEmpty()) {
            return new AuthResponse("Email and OTP are required", false);
        }

        if (newPassword == null || newPassword.isEmpty()) {
            return new AuthResponse("New password is required", false);
        }

        if (newPassword.length() < 6) {
            return new AuthResponse("Password must be at least 6 characters", false);
        }

        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);
        if (userOpt.isEmpty()) {
            return new AuthResponse("Email not found", false);
        }

        User user = userOpt.get();

        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            return new AuthResponse("No OTP found. Please request a new OTP.", false);
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            user.clearOtp();
            userRepository.save(user);
            return new AuthResponse("OTP has expired. Please request a new OTP.", false);
        }

        if (!user.getOtp().equals(otp.trim())) {
            return new AuthResponse("Invalid OTP. Please try again.", false);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.clearOtp();
        userRepository.save(user);

        logger.info("Password reset successfully for user: {}", normalizedEmail);
        return new AuthResponse("Password reset successfully", true);
    }

    private String generateOtp() {
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) {
            otp.append(random.nextInt(10));
        }
        return otp.toString();
    }

    public static String encodePassword(String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    public boolean verifyPassword(User user, String rawPassword) {
        if (user.getPassword() == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

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
