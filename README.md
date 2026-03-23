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
BookNest/
├── frontend/
│   ├── angular.json                          # Angular workspace configuration
│   ├── package.json                          # NPM dependencies and scripts
│   ├── package-lock.json                     # Locked dependency versions
│   ├── tsconfig.json                         # TypeScript compiler configuration
│   ├── tsconfig.app.json                     # App-specific TypeScript config
│   ├── .editorconfig                         # Editor formatting rules
│   ├── .gitignore                            # Git ignore patterns
│   ├── README.md                             # Project documentation
│   ├── TODO.md                               # Task tracking
│   ├── .vscode/
│   │   ├── extensions.json                   # Recommended VS Code extensions
│   │   ├── launch.json                      # Debug configuration
│   │   ├── tasks.json                       # VS Code tasks
│   │   └── mcp.json                         # MCP server config
│   ├── public/
│   │   ├── backend_fixed.zip                 # Backup of fixed backend
│   │   ├── src_fixed.zip                    # Backup of fixed frontend
│   │   └── images/
│   │       ├── login.jpg                    # Login page background
│   │       └── register.jpg                 # Register page background
│   └── src/
│       ├── index.html                        # Main HTML entry point
│       ├── main.ts                           # Angular bootstrap entry
│       ├── styles.css                        # Global styles
│       ├── environments/
│       │   ├── environment.ts               # Dev environment config
│       │   └── environment.prod.ts          # Production environment config
│       ├── assets/
│       │   ├── login.jpg                    # Login asset
│       │   ├── register.jpg                 # Register asset
│       │   ├── forgot-password.jpg           # Forgot password asset
│       │   ├── load.json                    # Loading animation JSON
│       │   ├── placeholder.svg              # Image placeholder SVG
│       │   ├── hero-library.svg             # Hero image SVG
│       │   └── hero-library2.svg            # Hero image SVG variant
│       └── app/
│           ├── app.ts                        # Root app component
│           ├── app.html                      # Root app template
│           ├── app.css                       # Root app styles
│           ├── app.routes.ts                 # Route definitions
│           ├── app.config.ts                 # App configuration
│           ├── utils/
│           │   └── scroll-to-top.ts         # Scroll to top utility
│           ├── models/
│           │   ├── book.model.ts            # Book interface/type
│           │   ├── borrow.model.ts          # Borrow request interface
│           │   ├── notice.model.ts          # Notice interface & priorities
│           │   └── user.model.ts            # User interface & roles
│           ├── services/
│           │   ├── auth.ts                  # Authentication service (login, register)
│           │   ├── book.ts                  # Book CRUD service
│           │   ├── borrow.ts                # Borrow requests service
│           │   ├── notice.ts                # Notices service
│           │   ├── snackbar.ts              # Snackbar notification service
│           │   └── user.ts                  # User management service
│           ├── guards/
│           │   ├── auth-guard.ts            # Protects authenticated routes
│           │   ├── admin-guard.ts           # Restricts to admin users
│           │   └── student-guard.ts         # Restricts to student users
│           ├── interceptors/
│           │   └── auth.interceptor.ts     # Attaches JWT tokens to requests
│           ├── auth/
│           │   ├── auth-module.ts          # Auth module configuration
│           │   ├── auth.validators.ts     # Form validation rules
│           │   ├── login/
│           │   │   ├── login.ts            # Login component
│           │   │   ├── login.html          # Login template
│           │   │   └── login.css          # Login styles
│           │   ├── register/
│           │   │   ├── register.ts         # Registration component
│           │   │   ├── register.html       # Registration template
│           │   │   └── register.css        # Registration styles
│           │   └── forgot-password/
│           │       ├── forgot-password.ts  # Forgot password component
│           │       ├── forgot-password.html # Forgot password template
│           │       └── forgot-password.css  # Forgot password styles
│           ├── components/
│           │   ├── navbar/
│           │   │   ├── navbar.ts           # Navigation bar component
│           │   │   ├── navbar.html          # Navbar template
│           │   │   └── navbar.css          # Navbar styles
│           │   ├── footer/
│           │   │   ├── footer.ts           # Footer component
│           │   │   ├── footer.html         # Footer template
│           │   │   └── footer.css          # Footer styles
│           │   ├── snackbar/
│           │   │   ├── snackbar.ts         # Toast notification component
│           │   │   ├── snackbar.html       # Snackbar template
│           │   │   └── snackbar.css        # Snackbar styles
│           │   ├── global-search-bar/
│           │   │   ├── global-search-bar.ts     # Search component
│           │   │   ├── global-search-bar.html   # Search template
│           │   │   └── global-search-bar.css     # Search styles
│           │   └── search-bar/
│           │       ├── search-bar.ts       # Simple search component
│           │       ├── search-bar.html     # Search template
│           │       └── search-bar.css      # Search styles
│           ├── core/layout/
│           │   ├── admin-layout/
│           │   │   ├── admin-layout.ts     # Admin layout wrapper
│           │   │   ├── admin-layout.html   # Admin layout template
│           │   │   ├── admin-layout.css    # Admin layout styles
│           │   │   └── admin-layout-modal.css # Modal styles
│           │   └── student-layout/
│           │       ├── student-layout.ts    # Student layout wrapper
│           │       ├── student-layout.html  # Student layout template
│           │       ├── student-layout.css   # Student layout styles
│           │       └── student-layout-modal.css # Modal styles
│           └── pages/
│               ├── home/
│               │   ├── home.ts            # Landing page component
│               │   ├── home.html           # Landing page template
│               │   └── home.css           # Landing page styles
│               ├── admin/
│               │   ├── dashboard/
│               │   │   ├── dashboard.ts   # Admin dashboard component
│               │   │   ├── dashboard.html # Admin dashboard template
│               │   │   └── dashboard.css  # Admin dashboard styles
│               │   ├── manage-books/
│               │   │   ├── manage-books.ts     # Book management component
│               │   │   ├── manage-books.html   # Book management template
│               │   │   └── manage-books.css    # Book management styles
│               │   ├── manage-students/
│               │   │   ├── manage-students.ts     # Student management component
│               │   │   ├── manage-students.html   # Student management template
│               │   │   └── manage-students.css    # Student management styles
│               │   ├── borrow-requests/
│               │   │   ├── borrow-requests.ts     # Borrow requests component
│               │   │   ├── borrow-requests.html   # Borrow requests template
│               │   │   └── borrow-requests.css    # Borrow requests styles
│               │   ├── notices/
│               │   │   ├── notices.ts     # Admin notices component
│               │   │   ├── notices.html   # Admin notices template
│               │   │   └── notices.css    # Admin notices styles
│               │   ├── reports/
│               │   │   ├── reports.ts     # Reports/analytics component
│               │   │   ├── reports.html   # Reports template
│               │   │   └── reports.css    # Reports styles
│               │   ├── profile/
│               │   │   ├── profile.ts     # Admin profile component
│               │   │   ├── profile.html   # Admin profile template
│               │   │   └── profile.css    # Admin profile styles
│               │   └── change-password/
│               │       ├── change-password.ts     # Admin password change
│               │       ├── change-password.html   # Password change template
│               │       └── change-password.css    # Password change styles
│               └── student/
│                   ├── dashboard/
│                   │   ├── dashboard.ts   # Student dashboard component
│                   │   ├── dashboard.html # Student dashboard template
│                   │   └── dashboard.css  # Student dashboard styles
│                   ├── browse-books/
│                   │   ├── browse-books.ts     # Book catalog component
│                   │   ├── browse-books.html   # Book catalog template
│                   │   └── browse-books.css    # Book catalog styles
│                   ├── my-books/
│                   │   ├── my-books.ts     # Student's borrowed books
│                   │   ├── my-books.html   # My books template
│                   │   └── my-books.css    # My books styles
│                   ├── my-library/
│                   │   ├── my-library.ts   # Personal library component
│                   │   ├── my-library.html # My library template
│                   │   └── my-library.css  # My library styles
│                   ├── history/
│                   │   ├── history.ts      # Borrowing history component
│                   │   ├── history.html    # History template
│                   │   └── history.css    # History styles
│                   ├── requests/
│                   │   ├── requests.ts     # Pending requests component
│                   │   ├── requests.html   # Requests template
│                   │   └── requests.css   # Requests styles
│                   ├── notices/
│                   │   ├── notices.ts      # Student notices component
│                   │   ├── notices.html    # Notices template
│                   │   └── notices.css    # Notices styles
│                   ├── my-activity/
│                   │   ├── my-activity.ts  # Activity log component
│                   │   ├── my-activity.html # Activity template
│                   │   └── my-activity.css # Activity styles
│                   ├── my-stats/
│                   │   ├── my-stats.ts     # Statistics component
│                   │   ├── my-stats.html   # Stats template
│                   │   └── my-stats.css    # Stats styles
│                   ├── profile/
│                   │   ├── profile.ts      # Student profile component
│                   │   ├── profile.html    # Profile template
│                   │   └── profile.css     # Profile styles
│                   └── change-password/
│                       ├── change-password.ts     # Student password change
│                       ├── change-password.html   # Password change template
│                       └── change-password.css     # Password change styles
│
├── backend/
│   ├── pom.xml                              # Maven project configuration
│   ├── mvnw                                 # Maven wrapper script (Unix)
│   ├── mvnw.cmd                             # Maven wrapper script (Windows)
│   ├── .gitignore                           # Git ignore patterns
│   ├── .gitattributes                      # Git attributes
│   ├── .classpath                          # Eclipse classpath
│   ├── .project                            # Eclipse project file
│   ├── .factorypath                        # Eclipse factory path
│   ├── .settings/                          # IDE settings
│   │   ├── org.eclipse.jdt.apt.core.prefs
│   │   ├── org.eclipse.jdt.core.prefs
│   │   └── org.eclipse.core.resources.prefs
│   └── src/
│       ├── main/
│       │   ├── resources/
│       │   │   └── application.properties   # App configuration (DB, server)
│       │   └── java/com/booknest/backend/
│       │       ├── BackendApplication.java  # Spring Boot main class
│       │       ├── config/
│       │       │   ├── SecurityConfig.java  # Spring Security config
│       │       │   └── BlockedUserFilter.java # Blocks suspended users
│       │       ├── controller/
│       │       │   ├── AuthController.java   # Login, register, password endpoints
│       │       │   ├── BookController.java   # Book CRUD operations
│       │       │   ├── BorrowController.java # Borrow request handling
│       │       │   ├── NoticeController.java # Notice management
│       │       │   ├── ReportController.java # Analytics & reports
│       │       │   └── UserController.java   # User management
│       │       ├── dto/
│       │       │   ├── AuthResponse.java     # JWT response DTO
│       │       │   ├── BorrowDTO.java         # Borrow request DTO
│       │       │   ├── LoginRequest.java     # Login credentials DTO
│       │       │   ├── RegisterRequest.java  # Registration DTO
│       │       │   └── StudentDTO.java       # Student info DTO
│       │       ├── model/
│       │       │   ├── Book.java            # Book entity
│       │       │   ├── Borrow.java           # Borrow record entity
│       │       │   ├── Notice.java           # Notice entity
│       │       │   ├── NoticePriority.java  # Notice priority enum
│       │       │   └── User.java             # User entity
│       │       ├── repository/
│       │       │   ├── BookRepository.java   # Book JPA repository
│       │       │   ├── BorrowRepository.java # Borrow JPA repository
│       │       │   ├── NoticeRepository.java # Notice JPA repository
│       │       │   └── UserRepository.java   # User JPA repository
│       │       ├── service/
│       │       │   ├── BookService.java     # Book business logic
│       │       │   ├── BorrowService.java   # Borrow business logic
│       │       │   ├── EmailService.java    # Email sending service
│       │       │   ├── NoticeService.java   # Notice business logic
│       │       │   ├── ReportService.java   # Report generation logic
│       │       │   └── UserService.java     # User business logic
│       │       └── util/
│       │           └── JwtUtil.java         # JWT token utilities
│       └── test/
│           └── java/com/booknest/backend/
│               └── BackendApplicationTests.java # Unit tests
│
├── .git/                                   # Git repository
├── README.md                               # Project documentation

```