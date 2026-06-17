# Secure Healthcare Portal

This project contains the frontend and backend structures for the Secure Healthcare Portal. Below is the full directory structure with simple, easy-to-understand explanations for each folder and file.

---

## 🔐 How Authentication Works

This app has **no passwords** — login is done using your **phone number + OTP**.

```
You enter your phone number
        ↓
App generates a 4-digit OTP
        ↓
OTP is saved in MongoDB (with a 2 min expiry)
        ↓
You enter the OTP
        ↓
App checks: Is it correct? Is it still fresh?
        ↓
✅ Yes → JWT token is created (your digital ID)
        ↓
Token is saved in your browser as a cookie 🍪
        ↓
Every future page visit → cookie is sent automatically → you're logged in
```

---

## 📁 Two Auth Folders (Don't Get Confused!)

```
app/(auth)/        →  The PAGES you see in the browser
                       Example: /login, /verify-otp
                       (The () hides it from the URL)

        ⇅

app/api/auth/      →  The HIDDEN logic behind those pages
                       Example: /api/auth/send-otp, /api/auth/logout
                       (No UI — just receives data & returns JSON)
```

> **Think of it this way:**
> `app/(auth)/` is the **shop front** (what users see).
> `app/api/auth/` is the **back office** (where the real work happens).

---

## Frontend Directory Structure

```text
frontend/                 -> Root Frontend Directory
|
├── app/                  -> Main Next.js App Router Folder
|   |
|   ├── (auth)/           -> Auth Route Group (Login/OTP)
|   |   ├── login/
|   |   |   └── page.js   -> Login Page UI
|   |   |
|   |   └── verify-otp/
|   |       └── page.js   -> OTP Verification Page UI
|   |
|   ├── admin/            -> Admin Pages
|   |   ├── products/
|   |   |   └── page.js   -> Admin Products Page
|   |   |
|   |   ├── loading.js    -> Admin Loading UI
|   |   └── page.js       -> Admin Dashboard UI
|   |
|   ├── api/              -> Backend API Routes
|   |   |
|   |   ├── admin/        -> Backend Endpoints for Admins
|   |   |   ├── route.js              -> Get All Admin Info
|   |   |   ├── approve/
|   |   |   |   └── [id]/
|   |   |   |       └── route.js      -> Approve Product by ID
|   |   |   |
|   |   |   ├── products/
|   |   |   |   ├── route.js          -> Get All Products (Admin)
|   |   |   |   └── [id]/
|   |   |   |       └── route.js      -> Manage Single Product by ID
|   |   |   |
|   |   |   └── users/
|   |   |       ├── route.js          -> Get All Users (Admin)
|   |   |       └── [id]/
|   |   |           └── route.js      -> Manage Single User by ID
|   |   |
|   |   ├── auth/         -> Backend Endpoints for Auth
|   |   |   ├── logout/
|   |   |   |   └── route.js          -> Logout User
|   |   |   ├── me/
|   |   |   |   └── route.js          -> Get Current Session User
|   |   |   ├── resend-otp/
|   |   |   |   └── route.js          -> Resend OTP to Email
|   |   |   ├── send-otp/
|   |   |   |   └── route.js          -> Send OTP to Email
|   |   |   └── verify-otp/
|   |   |       └── route.js          -> Verify OTP Code
|   |   |
|   |   ├── dashboard/    -> Backend Endpoints for Dashboard
|   |   |   └── route.js              -> Get Dashboard Stats
|   |   |
|   |   ├── products/     -> Backend Endpoints for Products
|   |   |   ├── my/
|   |   |   |   └── route.js          -> Get Current User's Products
|   |   |   └── register/
|   |   |       └── route.js          -> Register a New Product
|   |   |
|   |   ├── upload/       -> Backend Endpoints for Uploads
|   |   |   ├── route.js              -> Upload Product Image
|   |   |   └── service-images/
|   |   |       └── route.js          -> Upload Service Images
|   |   |
|   |   ├── user/         -> Backend Endpoints for Single User
|   |   |   ├── create-profile/
|   |   |   |   └── route.js          -> Create User Profile
|   |   |   └── update-profile/
|   |   |       └── route.js          -> Update User Profile
|   |   |
|   |   ├── users/        -> Backend Endpoints for All Users
|   |   |   └── route.js              -> Get All Users
|   |   |
|   |   ├── bookservice/  -> Backend Endpoints for Book a Service
|   |       └── route.js              -> Handle Book a Service Requests
|   |   |
|   |   └── requests/     -> Backend Endpoints for Service Requests
|   |       └── my/
|   |           └── route.js          -> Get Current User's Service Requests
|   |
|   ├── dashboard/        -> User Dashboard Pages
|   |   ├── products/
|   |   |   ├── [id]/
|   |   |   |   └── page.js -> Product Details UI
|   |   |   |
|   |   |   ├── register/
|   |   |   |   └── page.js -> Product Registration UI
|   |   |   |
|   |   |   └── page.js   -> My Products UI
|   |   |
|   |   ├── requests/     -> Service Requests Pages
|   |   |   ├── [id]/
|   |   |   |   └── page.js -> Request Details UI
|   |   |   |
|   |   |   └── page.js   -> My Requests UI
|   |   |
|   |   ├── page.js       -> User Dashboard UI
|   |   └── loading.js    -> Dashboard Loading UI
|   |
|   ├── profile/          -> User Profile Pages
|   |   ├── edit/
|   |   |   └── page.js   -> Edit Profile UI
|   |   |
|   |   └── page.js       -> View Profile UI
|   |
|   ├── error.js          -> Global Error UI
|   ├── layout.js         -> Global App Layout
|   ├── loading.js        -> Global Loading UI
|   └── page.js           -> Landing Page UI
|
├── components/           -> Reusable UI Components
|   ├── adminDashboard/   -> Admin Specific Components
|   |   ├── AdminPage.js
|   |   ├── AdminStats.js
|   |   ├── InfoCard.js
|   |   ├── ProductsPage.js
|   |   └── ThemeProvider.js
|   |
|   └── userDashboard/    -> User Specific Components
|       ├── BookServiceModal.js
|       ├── DashboardCards.js
|       ├── DashboardHeader.js
|       ├── DashboardPage.js
|       ├── DashboardRoute.js
|       ├── ProductDetailsClient.js
|       ├── ProductList.js
|       ├── ProductsPage.js
|       ├── RequestDetailsClient.js
|       ├── RequestList.js
|       └── SearchBar.js
|
├── forms/                -> Form Components
|   ├── AuthForm.js       -> Login Form
|   ├── OtpForm.js        -> OTP Form
|   ├── ProductRegistrationForm.js -> Register Product Form
|   └── ProfileForm.js    -> Edit Profile Form
|
├── layouts/              -> Page Wrapper Layouts
|   ├── MainLayout.js     -> Main Container
|   ├── Navbar.js         -> Top Navigation
|   └── Sidebar.js        -> Side Navigation
|
├── styles/               -> Global CSS Styles
|   └── globals.css       -> Tailwind & Global CSS
|
├── tables/               -> Data Table Components
|   ├── adminTables/      -> Tables for Admins
|   |   ├── UserFilters.js
|   |   ├── UserPagination.js
|   |   ├── UserRow.js
|   |   └── UsersTable.js
|   |
|   └── userTables/       -> Tables for Users
|       ├── ProductFilters.js
|       ├── ProductPagination.js
|       ├── ProductRow.js
|       └── ProductsTable.js
|
├── ui/                   -> Basic UI Elements
|   ├── Alert.js
|   ├── AuthLayout.js
|   ├── Button.js
|   ├── ErrorBox.js
|   ├── Input.js
|   ├── Loader.js
|   └── ThemeToggle.js
|
├── middleware.js         -> Route Protection Logic
├── next.config.js        -> Next.js Settings
├── jsconfig.json         -> JS Path Aliases
├── tailwind.config.js    -> Tailwind Settings
├── postcss.config.js     -> PostCSS Settings
├── package.json          -> Project Dependencies
└── .eslintrc.json        -> ESLint Rules
```

## Backend Directory Structure

```text
backend/                  -> Root Backend Directory
|
├── config/               -> Configuration Files
|   └── cloudinary.js     -> Cloudinary Upload Config
|
├── controllers/          -> Business Logic Handlers
|   ├── adminController.js        -> Handles Admin Logic
|   ├── authController.js         -> Handles Auth/Login Logic
|   ├── bookServiceController.js  -> Handles Book a Service Logic
|   ├── productController.js      -> Handles Product Logic
|   ├── uploadController.js       -> Handles Upload Logic
|   └── userController.js         -> Handles User Logic
|
├── database/             -> Database Setup
|   ├── connection/
|   |   └── db.js         -> MongoDB Connection
|   |
|   └── models/           -> Database Schemas
|       ├── BookService.js   -> Book a Service Schema
|       ├── GeneratedOtp.js  -> OTP Schema
|       ├── Product.js       -> Product Schema
|       └── User.js          -> User Schema
|
├── middleware/           -> Request Interceptors
|   └── routeGuards.js    -> Auth/Role Protection
|
├── scripts/              -> Utility Scripts
|   ├── dropStaleIndexes.js  -> DB Cleanup Script
|   └── seedAdmin.js         -> Create Initial Admin
|
├── services/             -> Reusable Logic Services
|   ├── authService.js         -> Auth Helper Functions
|   ├── email/                 -> Email Sending Services
|   |   ├── sendProductRegistrationEmail.js -> Send Product Registration Email
|   |   ├── sendServiceRequestEmail.js      -> Send Service Request Email
|   |   └── sendWelcomeEmail.js             -> Send Welcome Email
|   |
|   ├── productService.js      -> Product Helper Functions
|   ├── serviceRequestService.js -> Service Request Helper Functions
|   ├── uploadService.js       -> Upload Helper Functions
|   └── userService.js         -> User Helper Functions
|
├── templates/            -> Email HTML Templates
|   ├── productRegistrationTemplate.js -> Product Registration Email Template
|   ├── serviceRequestTemplate.js      -> Service Request Email Template
|   └── welcomeTemplate.js             -> Welcome Email Template
|
└── utils/                -> Helper Utilities
    ├── auth.js           -> JWT/Hash Utilities
    ├── emailTransporter.js -> Nodemailer SMTP Transporter
    ├── otp.js            -> OTP Generation
    └── session.js        -> Session Utilities
```
