package com.booknest.backend.controller;

import com.booknest.backend.model.User;
import com.booknest.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<User>> getAllStudents() {
        List<User> students = userRepository.findAll();
        // Filter out admin users, only return students
        students.removeIf(user -> user.getRole() == User.Role.ADMIN);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
}
