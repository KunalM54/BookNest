# Task: Fix Admin Profile - Connect with Backend & Add Credential Invalidation

## Plan:
1. **Backend - UserService.java**: Modify admin login to create/get admin user in database so profile can be fetched
2. **Backend - UserController.java**: Add endpoint to get current logged-in user's profile from JWT token
3. **Backend - UserController.java**: Update profile to return flag when credentials change (to force logout)
4. **Frontend - profile.ts**: Use the new endpoint to fetch profile and handle forced logout
5. **Backend - UserController.java**: Add change-password endpoint
6. **Backend - UserService.java**: Add password encoding/verification methods
7. **Frontend - change-password.ts**: Connect to backend API

## Status: Completed
- [x] Backend: Modify UserService.java for admin in database
- [x] Backend: Add /me endpoint in UserController.java  
- [x] Backend: Update profile update to return force logout flag
- [x] Frontend: Update profile.ts to use /me endpoint and handle logout
- [x] Backend: Add change-password endpoint
- [x] Backend: Add password encoding/verification helper methods
- [x] Frontend: Connect change-password to backend API

---

# Task: Fix Login Page Validation

## Plan:
1. **login.ts**: Add FormGroup with Validators to properly track form state
2. **login.ts**: Add submitted flag to track when user tries to submit
3. **login.html**: Update validation conditions to show errors when form is submitted OR when fields are touched
4. **login.html**: Disable submit button when form is invalid

## Status: Completed
- [x] Analyze the login page code
- [x] Update login.ts with FormGroup and Validators
- [x] Update login.html with proper validation display
- [x] Test the login page validation

