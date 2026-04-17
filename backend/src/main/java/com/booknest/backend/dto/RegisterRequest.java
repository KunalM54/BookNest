package com.booknest.backend.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RegisterRequest {
    private String fullName;
    @JsonProperty("studentId")
    @JsonAlias({"sID", "sid", "SID"})
    private String studentId;
    private String email;
    private String password;
    private String confirmPassword;

    public RegisterRequest() {}

    public RegisterRequest(String fullName, String studentId, String email, String password, String confirmPassword) {
        this.fullName = fullName;
        this.studentId = studentId;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getSID() { return studentId; }
    public void setSID(String sID) { this.studentId = sID; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
}
