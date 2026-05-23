# 🏥 Home Healthcare Services Portal

A **secure, full-stack** healthcare web app built with **Next.js**, **MongoDB**, and **JWT authentication**.

---

## 🔐 How Authentication Works

This app has **no passwords** — login is done using your **phone number + OTP**.

```text
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

**Two auth folders (don't get confused!):**

```text
app/(auth)/          → The PAGES you see in the browser
                        Example: /login, /verify-otp
                        (The () hides it from the URL)
        ↕
app/api/auth/        → The HIDDEN logic behind those pages
                        Example: /api/auth/send-otp, /api/auth/logout
                        (No UI — just receives data & returns JSON)
```

---

## 🔑 How JWT Works

JWT = a **digital wristband** the server gives you after login.
You show it on every visit — no need to log in again.

```text
You log in (OTP verified)
        ↓
Server creates a JWT token with 3 parts:

eyJhbGci...    ← Part 1: Header    — which algorithm signed it (HS256)
.eyJpZCI6...   ← Part 2: Payload   — YOUR info (id, name, role)
.abc123xyz     ← Part 3: Signature — tamper-proof seal
        ↓
Token is stored in a cookie named: auth_token
        ↓
🔒 HttpOnly  → JavaScript can't read it (safe from hackers)
⏱️ Expires   → After 1 day, you must log in again
🚪 Session   → Cookie is deleted when the browser closes
```

---

## 📁 Project Folder Structure

---


### 1. `frontend/` — UI Components

```text
frontend/                        ← Everything Next.js (UI, pages)
├── app/                         
│   ├── (auth)/                  
│   │   ├── login/page.js        → /login page (UI)
│   │   └── verify-otp/page.js   → /verify-otp page (UI)
│   ├── api/                     
│   │   ├── admin/               → Backend Endpoints for Admins
│   │   ├── auth/                → Backend Endpoints for Auth
│   │   ├── dashboard/           → Backend Endpoints for Dashboard
│   │   ├── products/            → Backend Endpoints for Products
│   │   ├── upload/              → Backend Endpoints for Uploads
│   │   ├── user/                → Backend Endpoints for User
│   │   └── users/               → Backend Endpoints for Users
│   ├── admin/                   
│   │   ├── loading.js           → Loading spinner for /admin
│   │   ├── page.js              → /admin page (Admin UI)
│   │   └── products/page.js     → /admin/products page
│   ├── dashboard/               
│   │   ├── loading.js           → Loading spinner for /dashboard
│   │   ├── page.js              → /dashboard page (User UI)
│   │   └── products/            
│   │       ├── page.js          → /dashboard/products page
│   │       └── register/page.js → Register product page
│   ├── profile/page.js          → /profile page (complete your info)
│   ├── error.js                 → Global error page
│   ├── layout.js                → Root HTML wrapper (wraps ALL pages)
│   ├── loading.js               → Global loading page
│   └── page.js                  → Home page / (redirects based on role)
│
├── components/                  ← Dashboard-specific widgets
│   ├── adminDashboard/          
│   │   ├── AdminPage.js         → /admin page content (user list & access)
│   │   ├── AdminStats.js        → Approval stats chart
│   │   ├── InfoCard.js          → Stat card (Total Users, Pending…)
│   │   ├── ProductsPage.js      → /admin/products content
│   │   └── ThemeProvider.js     → Dark/light mode provider
│   │
│   └── userDashboard/           
│       ├── DashboardCards.js    → Quick action cards
│       ├── DashboardHeader.js   → Welcome banner
│       ├── DashboardPage.js     → /dashboard main content
│       ├── DashboardRoute.js    → Auth check + layout for /dashboard
│       ├── ProductList.js       → Product list with details
│       ├── ProductsPage.js      → /dashboard/products content
│       └── SearchBar.js         → Search input
│
├── forms/                       ← Input Forms
│   ├── AuthForm.js              → Login & Signup form (shared)
│   ├── OtpForm.js               → OTP verification form
│   ├── ProductRegistrationForm.js → Register a new product
│   └── ProfileForm.js           → Complete user profile form
│
├── layouts/                     ← Wrappers
│   ├── MainLayout.js            → Navbar + Sidebar wrapper (used on every page)
│   ├── Navbar.js                → Top navigation bar
│   └── Sidebar.js               → Left sidebar menu
│
├── tables/                      ← Data Tables
│   ├── adminTables/             
│   │   ├── UserFilters.js       → Filter bar for users
│   │   ├── UserPagination.js    → Page controls for users table
│   │   ├── UserRow.js           → Single row in users table
│   │   └── UsersTable.js        → All users table (admin)
│   │
│   └── userTables/              
│       ├── ProductFilters.js    → Filter bar for products
│       ├── ProductPagination.js → Page controls for products table
│       ├── ProductRow.js        → Single row in products table
│       └── ProductsTable.js     → All products table (user)
│
├── ui/                          ← Small reusable pieces
│   ├── Alert.js                 → Alert/notification message
│   ├── AuthLayout.js            → Centered wrapper for login/OTP pages
│   ├── Button.js                → Reusable button
│   ├── ErrorBox.js              → Error message box
│   ├── Input.js                 → Reusable text input
│   ├── Loader.js                → Loading spinner
│   └── ThemeToggle.js           → Dark/light mode toggle
│
├── styles/globals.css           → Global CSS for the whole app
├── middleware.js                → 🔒 Runs before every page — protects routes
└── next.config.js               → Next.js configuration
```

---

### 2. `backend/` — Server Logic (User Never Sees This)

```text
backend/                         ← The hidden server logic
├── controllers/                 ← STEP 1: Handles each request
│   ├── adminController.js       → Handles user approval & product management
│   ├── authController.js        → Handles OTP login, logout, who-am-I
│   ├── productController.js     → Handles register & fetch products
│   ├── uploadController.js      → Handles image uploads to Cloudinary
│   └── userController.js        → Handles get/update user profile
│
├── services/                    ← STEP 2: Business logic + talks to DB
│   ├── authService.js           → OTP generation, verification, JWT creation
│   ├── productService.js        → Create/read products from MongoDB
│   ├── uploadService.js         → Upload images via Cloudinary
│   └── userService.js           → Read/update users in MongoDB
│
├── database/                    ← STEP 3: MongoDB
│   ├── connection/db.js         → Connects to MongoDB
│   └── models/                  
│       ├── GeneratedOtp.js      → OTP schema (phone, code, expiry)
│       ├── Product.js           → Product schema
│       └── User.js              → User schema (name, phone, role…)
│
├── middleware/routeGuards.js    → requireAuth() & requireAdmin() helpers
│
├── utils/                       
│   ├── auth.js                  → createToken(), readToken(), cookieSettings()
│   ├── otp.js                   → generateOtp(), createOtpExpiry()
│   └── session.js               → getCurrentUser() — reads JWT from cookie
│
├── config/cloudinary.js         → Cloudinary setup
└── scripts/                     
    ├── dropStaleIndexes.js      → Cleanup script for MongoDB indexes
    └── seedAdmin.js             → Run ONCE to create first admin user
```

---

### 3. Root Files

```text
(Project Root)
├── .env.local                   → 🔑 Secret keys (DB URL, JWT secret) — NEVER share!
├── .gitignore                   → Files Git should ignore
├── package-lock.json            → Exact dependency versions (auto-generated)
└── package.json                 → Run scripts (npm run dev) & workspace config
```

---

## 🔗 How They Connect

```text
User fills a form (Frontend)
       ↓  API Route  — just forwards the request
       ↓  Controller — validates the data
       ↓  Service    — talks to the database
       ↓  MongoDB    — saves/reads the data
```

---

## 🌐 How API Routes Work

An API route is just a **bridge** — it has no logic. It receives data from the frontend and passes it straight to a controller.

```javascript
export async function POST(req) {
  return sendOtpHandler(req); // just forwards, nothing else
}
```

**API Endpoints:**

| Method | URL | What It Does |
|--------|-----|--------------|
| `POST` | `/api/auth/send-otp` | Send OTP |
| `POST` | `/api/auth/verify-otp` | Verify OTP, log in |
| `POST` | `/api/auth/resend-otp` | Resend OTP |
| `POST` | `/api/auth/logout` | Log out |
| `GET`  | `/api/auth/me` | Who is logged in? |
| `GET`  | `/api/user/...` | User profile (auth required) |
| `GET/POST` | `/api/products/...` | Product actions |
| `POST` | `/api/upload/...` | Upload image |
| `GET/POST` | `/api/admin/...` | Admin only |

---

## 🛡️ How Route Protection Works

**Two layers of guards:**

**Layer 1 — `middleware.js`** (runs before every page loads)

| Route | Not Logged In | User | Admin |
|-------|--------------|------|-------|
| `/dashboard` | → `/login` | ✅ | → `/admin` |
| `/admin` | → `/login` | → `/dashboard` | ✅ |
| `/login` | ✅ | → `/dashboard` | → `/admin` |

**Layer 2 — `routeGuards.js`** (inside controllers, server-side check)
- `requireAuth()` → blocks if not logged in
- `requireAdmin()` → blocks if not admin

---

## 📂 Quick Folder Guide

| Folder | What It Does |
|--------|-------------|
| `frontend/app/(auth)/` | Login & OTP pages |
| `frontend/app/api/` | All API endpoints |
| `frontend/components/` | Reusable UI widgets |
| `frontend/forms/` | Form components |
| `frontend/layouts/` | Navbar + Sidebar |
| `frontend/ui/` | Button, Input, Alert… |
| `frontend/middleware.js` | 🔒 Page protection |
| `backend/controllers/` | Handle requests |
| `backend/services/` | Business logic + DB |
| `backend/database/models/` | MongoDB schemas |
| `backend/utils/auth.js` | JWT helpers |
| `backend/utils/session.js` | Get current user |
| `backend/scripts/seedAdmin.js` | Create first admin |
| `.env.local` | 🔑 Secret keys |

---

## 🚀 URL → Page Reference

| URL | Page | Component |
|-----|------|-----------|
| `/login` | Login | `forms/AuthForm.js` |
| `/verify-otp` | OTP input | `forms/OtpForm.js` |
| `/dashboard` | User home | `userDashboard/DashboardPage.js` |
| `/dashboard/products` | My products | `userDashboard/ProductsPage.js` |
| `/dashboard/products/register` | Register product | `forms/ProductRegistrationForm.js` |
| `/admin` | Admin panel | `adminDashboard/AdminPage.js` |
| `/admin/products` | All products | `adminDashboard/ProductsPage.js` |

---

