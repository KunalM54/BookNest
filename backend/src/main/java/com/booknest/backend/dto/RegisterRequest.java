package com.booknest.backend.dto;

public class RegisterRequest {
    private String fullName;
    private String sID;
    private String email;
    private String password;
    private String confirmPassword;

    public RegisterRequest() {}

    public RegisterRequest(String fullName, String sID, String email, String password, String confirmPassword) {
        this.fullName = fullName;
        this.sID = sID;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getSID() { return sID; }
    public void setSID(String sID) { this.sID = sID; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
}
