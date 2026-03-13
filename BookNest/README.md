# Full stack project - BookNest

```
1. html
2. css
3. angular
4. typescript
5. java
6. springboot
7. mysql
```

# Flow of Website

```
1. load home page first
2. if user explore more or try to explore books than login or registration required
3. than registration for first time, than login using same credentials
4. if user already register than login
```

# Common Features

```
1. Login/Logout
2. Forgot password
3. Dashboard with summary
4. Notifications/Alerts
```

# Student Features

```
1. Browse and search books
2. Check book availability
3. Send book request to admin
4. View request status
5. See currently borrowed books
6. Check return due dates
7. View borrowing history
8. Read library notices
9. Update profile details
10. Change password
```

# Admin Features

```
1. Browse and search books
2. Check book availability
3. Send book request to admin
4. View request status
5. See currently borrowed books
6. Check return due dates
7. View borrowing history
8. Read library notices
9. Update profile details
10. Change password
```

# Structure

```
BookNest_Project/
│
├── backend/                                 (Spring Boot + Java + MySQL)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/booknest/
│   │   │   │
│   │   │   │   ├── BookNestApplication.java
│   │   │   │
│   │   │   │   ├── controller/              (REST APIs)
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── BookController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   ├── BorrowController.java
│   │   │   │   │   └── NoticeController.java
│   │   │   │
│   │   │   │   ├── service/                 (Business Logic)
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── BookService.java
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── BorrowService.java
│   │   │   │   │   └── NoticeService.java
│   │   │   │
│   │   │   │   ├── repository/              (Database Layer)
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── BookRepository.java
│   │   │   │   │   ├── BorrowRepository.java
│   │   │   │   │   └── NoticeRepository.java
│   │   │   │
│   │   │   │   ├── model/                   (Entities / Tables)
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Book.java
│   │   │   │   │   ├── BorrowRecord.java
│   │   │   │   │   ├── Notice.java
│   │   │   │   │   └── Role.java
│   │   │   │
│   │   │   │   ├── dto/                     (Request / Response DTOs)
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── LoginResponse.java
│   │   │   │   │   ├── BookDTO.java
│   │   │   │   │   └── UserDTO.java
│   │   │   │
│   │   │   │   └── config/                  (Security & JWT)
│   │   │   │       ├── SecurityConfig.java
│   │   │   │       └── JwtConfig.java
│   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   └── pom.xml
│
│
└── frontend/                                (Angular + HTML + CSS + TS)
    ├── src/
    │   ├── app/
    │   │
    │   │   ├── core/                        (Layouts & app-wide logic)
    │   │   │   └── layout/
    │   │   │       ├── admin-layout/
    │   │   │       │   ├── admin-layout.component.ts
    │   │   │       │   ├── admin-layout.component.html
    │   │   │       │   └── admin-layout.component.css
    │   │   │       │
    │   │   │       └── student-layout/
    │   │   │           ├── student-layout.component.ts
    │   │   │           ├── student-layout.component.html
    │   │   │           └── student-layout.component.css
    │   │   │
    │   │   ├── auth/                        (Authentication)
    │   │   │   ├── login/
    │   │   │   │   ├── login.component.ts
    │   │   │   │   ├── login.component.html
    │   │   │   │   └── login.component.css
    │   │   │   │
    │   │   │   ├── register/
    │   │   │   │   ├── register.component.ts
    │   │   │   │   ├── register.component.html
    │   │   │   │   └── register.component.css
    │   │   │   │
    │   │   │   └── forgot-password/
    │   │   │       ├── forgot-password.component.ts
    │   │   │       ├── forgot-password.component.html
    │   │   │       └── forgot-password.component.css
    │   │
    │   │   ├── pages/                       (All main screens)
    │   │   │
    │   │   │   ├── home/
    │   │   │   │   ├── home.component.ts
    │   │   │   │   ├── home.component.html
    │   │   │   │   └── home.component.css
    │   │   │   │
    │   │   │   ├── student/
    │   │   │   │   ├── dashboard/
    │   │   │   │   │   ├── dashboard.component.ts
    │   │   │   │   │   ├── dashboard.component.html
    │   │   │   │   │   └── dashboard.component.css
    │   │   │   │   │
    │   │   │   │   ├── browse-books/
    │   │   │   │   │   ├── browse-books.component.ts
    │   │   │   │   │   ├── browse-books.component.html
    │   │   │   │   │   └── browse-books.component.css
    │   │   │   │   │
    │   │   │   │   ├── requests/
    │   │   │   │   │   ├── requests.component.ts
    │   │   │   │   │   ├── requests.component.html
    │   │   │   │   │   └── requests.component.css
    │   │   │   │   │
    │   │   │   │   ├── my-books/
    │   │   │   │   │   ├── my-books.component.ts
    │   │   │   │   │   ├── my-books.component.html
    │   │   │   │   │   └── my-books.component.css
    │   │   │   │   │
    │   │   │   │   ├── history/
    │   │   │   │   │   ├── history.component.ts
    │   │   │   │   │   ├── history.component.html
    │   │   │   │   │   └── history.component.css
    │   │   │   │   │
    │   │   │   │   ├── notices/
    │   │   │   │   │   ├── notices.component.ts
    │   │   │   │   │   ├── notices.component.html
    │   │   │   │   │   └── notices.component.css
    │   │   │   │   │
    │   │   │   │   ├── profile/
    │   │   │   │   │   ├── profile.component.ts
    │   │   │   │   │   ├── profile.component.html
    │   │   │   │   │   └── profile.component.css
    │   │   │   │   │
    │   │   │   │   └── change-password/
    │   │   │   │       ├── change-password.component.ts
    │   │   │   │       ├── change-password.component.html
    │   │   │   │       └── change-password.component.css
    │   │   │
    │   │   │   └── admin/
    │   │   │       ├── dashboard/
    │   │   │       │   ├── dashboard.component.ts
    │   │   │       │   ├── dashboard.component.html
    │   │   │       │   └── dashboard.component.css
    │   │   │       │
    │   │   │       ├── manage-books/
    │   │   │       │   ├── manage-books.component.ts
    │   │   │       │   ├── manage-books.component.html
    │   │   │       │   └── manage-books.component.css
    │   │   │       │
    │   │   │       ├── manage-students/
    │   │   │       │   ├── manage-students.component.ts
    │   │   │       │   ├── manage-students.component.html
    │   │   │       │   └── manage-students.component.css
    │   │   │       │
    │   │   │       ├── borrow-requests/
    │   │   │       │   ├── borrow-requests.component.ts
    │   │   │       │   ├── borrow-requests.component.html
    │   │   │       │   └── borrow-requests.component.css
    │   │   │       │
    │   │   │       ├── reports/
    │   │   │       │   ├── reports.component.ts
    │   │   │       │   ├── reports.component.html
    │   │   │       │   └── reports.component.css
    │   │   │       │
    │   │   │       ├── notices/
    │   │   │       │   ├── notices.component.ts
    │   │   │       │   ├── notices.component.html
    │   │   │       │   └── notices.component.css
    │   │   │       │
    │   │   │       ├── profile/
    │   │   │       │   ├── profile.component.ts
    │   │   │       │   ├── profile.component.html
    │   │   │       │   └── profile.component.css
    │   │   │       │
    │   │   │       └── change-password/
    │   │   │           ├── change-password.component.ts
    │   │   │           ├── change-password.component.html
    │   │   │           └── change-password.component.css
    │   │
    │   │   ├── components/                  (Reusable UI)
    │   │   │   ├── navbar/
    │   │   │   ├── sidebar/
    │   │   │   └── footer/
    │   │
    │   │   ├── services/                    (API layer)
    │   │   │   ├── auth.service.ts
    │   │   │   ├── book.service.ts
    │   │   │   ├── user.service.ts
    │   │   │   ├── borrow.service.ts
    │   │   │   └── notice.service.ts
    │   │
    │   │   ├── models/                      (Interfaces)
    │   │   │   ├── user.model.ts
    │   │   │   ├── book.model.ts
    │   │   │   ├── borrow.model.ts
    │   │   │   └── notice.model.ts
    │   │
    │   │   ├── guards/                      (Route protection)
    │   │   │   ├── auth.guard.ts
    │   │   │   ├── admin.guard.ts
    │   │   │   └── student.guard.ts
    │   │
    │   │   ├── app.routes.ts
    │   │   ├── app.component.ts
    │   │   └── app.component.html
    │
    │   ├── assets/
    │   ├── styles.css
    │   └── index.html
    │
    ├── angular.json
    ├── package.json
    └── tsconfig.json
```
