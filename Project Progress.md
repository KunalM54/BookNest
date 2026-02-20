# Basic Project create command and configuration

```
1. mkdir BookNest_Project
cd BookNest_Project

2. Create Angular app
ng new frontend

3. Choose:
# - Angular routing? → Yes
# - Stylesheet? → CSS

4. cd frontend
npm install bootstrap bootstrap-icons

5. Edit angular.json - find "styles" and "scripts":

"styles": [
  "src/styles.css",
  "node_modules/bootstrap/dist/css/bootstrap.min.css",
  "node_modules/bootstrap-icons/font/bootstrap-icons.css"
],
"scripts": [
  "node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
]


6. Update Global Styles(styles.css) with some styling code
```


# frontend Component

```
ng generate component pages/home
ng generate component pages/login
ng generate component pages/register
ng generate component pages/forgot-password
ng generate component pages/student-dashboard
ng generate component pages/admin-dashboard
```

# Layout Components (Navbar & Footer) 
```
ng generate component components/navbar
ng generate component components/footer
```


# Admin Dashboard

```
ng generate component pages/admin-dashboard
ng generate component pages/admin-books
ng generate component pages/admin-requests
ng generate component pages/admin-users
ng generate component pages/admin-profile
```


# Things that Already Done

```
1. Landing page (home page)
2. Login & Registration
3. connect to admin and student dashboard using dummy credentials
```