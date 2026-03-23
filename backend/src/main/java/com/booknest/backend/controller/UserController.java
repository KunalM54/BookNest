package com.booknest.backend.controller;

import com.booknest.backend.dto.StudentDTO;
import com.booknest.backend.model.User;
import com.booknest.backend.repository.BorrowRepository;
import com.booknest.backend.repository.UserRepository;
import com.booknest.backend.service.UserService;
import com.booknest.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BorrowRepository borrowRepository;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        List<User> students = userRepository.findAll();
        // Filter out admin users, only return students
        students.removeIf(user -> user.getRole() == User.Role.ADMIN);
        List<StudentDTO> result = students.stream()
                .map(user -> new StudentDTO(
                        user.getId(),
                        user.getFullName(),
                        user.getStudentId(),
                        user.getEmail(),
                        user.getRole().name(),
                        user.isActive(),
                        borrowRepository.countByStudent(user)
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // Get current logged-in user's profile from JWT token
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid token"));
            }
            
            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            
            return userRepository.findByEmail(email)
                    .map(user -> {
                        // Don't return password
                        user.setPassword(null);
                        Map<String, Object> result = new HashMap<>();
                        result.put("id", user.getId());
                        result.put("fullName", user.getFullName());
                        result.put("studentId", user.getStudentId());
                        result.put("email", user.getEmail());
                        result.put("phone", user.getPhone());
                        result.put("department", user.getDepartment());
                        result.put("role", user.getRole().name());
                        result.put("active", user.isActive());
                        result.put("borrowedCount", borrowRepository.countActiveByStudent(user));
                        result.put("readCount", borrowRepository.countReturnedByStudent(user));
                        return ResponseEntity.ok(result);
                    })
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Invalid token"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        Map<String, Object> response = new HashMap<>();
        
        return userRepository.findById(id)
                .map(user -> {
                    boolean emailChanged = false;
                    
                    // Update fields if provided
                    if (updates.containsKey("fullName") && updates.get("fullName") != null) {
                        user.setFullName(updates.get("fullName"));
                    }
                    if (updates.containsKey("email") && updates.get("email") != null) {
                        // Check if email is already taken by another user
                        String newEmail = updates.get("email");
                        User existingUser = userRepository.findByEmail(newEmail).orElse(null);
                        if (existingUser != null && !existingUser.getId().equals(id)) {
                            response.put("success", false);
                            response.put("message", "Email already in use");
                            return ResponseEntity.badRequest().body(response);
                        }
                        // Check if email actually changed
                        if (!user.getEmail().equals(newEmail)) {
                            emailChanged = true;
                        }
                        user.setEmail(newEmail);
                    }
                    if (updates.containsKey("phone") && updates.get("phone") != null) {
                        user.setPhone(updates.get("phone"));
                    }
                    if (updates.containsKey("department") && updates.get("department") != null) {
                        user.setDepartment(updates.get("department"));
                    }
                    
                    User updatedUser = userRepository.save(user);
                    response.put("success", true);
                    response.put("message", "Profile updated successfully");
                    // If email changed, force logout - user must login with new credentials
                    response.put("forceLogout", emailChanged);
                    response.put("user", updatedUser);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "User not found");
                    return ResponseEntity.notFound().build();
                });
    }

    @PutMapping("/{id}/block")
    public ResponseEntity<Map<String, Object>> blockStudent(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setActive(false);
                    userRepository.save(user);
                    response.put("success", true);
                    response.put("message", "Student blocked successfully");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Student not found");
                    return ResponseEntity.notFound().build();
                });
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<Map<String, Object>> activateStudent(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        return userRepository.findById(id)
                .map(user -> {
                    user.setActive(true);
                    userRepository.save(user);
                    response.put("success", true);
                    response.put("message", "Student activated successfully");
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "Student not found");
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteStudent(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            response.put("success", true);
            response.put("message", "Student deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Student not found");
            return ResponseEntity.notFound().build();
        }
    }

    // Change password endpoint
    @PutMapping("/{id}/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData) {
        Map<String, Object> response = new HashMap<>();
        
        return userRepository.findById(id)
                .map(user -> {
                    String currentPassword = passwordData.get("currentPassword");
                    String newPassword = passwordData.get("newPassword");
                    
                    if (currentPassword == null || newPassword == null) {
                        response.put("success", false);
                        response.put("message", "Current and new password are required");
                        return ResponseEntity.badRequest().body(response);
                    }
                    
                    // For admin with hardcoded credentials, check against the hardcoded password
                    boolean isValidPassword = false;
                    if (user.getRole() == User.Role.ADMIN) {
                        // Admin - use password encoder to verify (BCrypt generates different hash each time)
                        isValidPassword = userService.verifyPassword(user, currentPassword);
                    } else {
                        // Student - use password encoder
                        isValidPassword = userService.verifyPassword(user, currentPassword);
                    }
                    
                    if (!isValidPassword) {
                        response.put("success", false);
                        response.put("message", "Current password is incorrect");
                        return ResponseEntity.badRequest().body(response);
                    }
                    
                    // Update password
                    user.setPassword(userService.encodePassword(newPassword));
                    userRepository.save(user);
                    
                    response.put("success", true);
                    response.put("message", "Password changed successfully");
                    response.put("forceLogout", true);
                    return ResponseEntity.ok(response);
                })
                .orElseGet(() -> {
                    response.put("success", false);
                    response.put("message", "User not found");
                    return ResponseEntity.notFound().build();
                });
    }
}
