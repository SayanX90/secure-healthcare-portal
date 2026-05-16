# Home Healthcare Services

This project uses a **monolithic architecture** split into two main parts.

## 🏗️ Folder Structure

```text
project-root/
├── frontend/     ← What the user sees (UI, Pages, React)
└── backend/      ← The hidden logic (Database, Security, Server)
```

---

## 🔗 How They Connect

When a user clicks a button (like "Submit"), the data flows like this:

```text
User clicks a button
       ↓
frontend/app/api/        (API Route catches the request)
       ↓
backend/controllers/     (Validates the data)
       ↓
backend/services/        (Does the heavy lifting)
       ↓
backend/database/models/ (Saves to MongoDB)
```

---

## 🌐 How API Routes Work

An API route acts simply as a **bridge** between the frontend and the backend.

1. The form on the webpage (frontend) sends data to the API route.
2. The API route **does not process the data or make any decisions**. 
3. It simply forwards the exact data directly to the `backend/controllers`.

This keeps our frontend completely separated from our backend!

**Code Example:**
```javascript
export async function POST(req) {
  // The API route just forwards the request to the backend! No logic here.
  return loginController(req); 
}
```

---

## 🔐 The Two `auth` Folders

If you look in `frontend/app/`, you will see two auth folders. Here is the difference:

- `frontend/app/(auth)` → **Frontend Pages**: The actual UI you see for login/signup. The `()` hides it from the URL.
- `frontend/app/api/auth` → **Backend Endpoints**: Hidden URLs that receive form data. They have no UI.

---

## 📂 Quick Folder Guide

### 1. `frontend/` — UI Components
```text
frontend/                        ← Everything Next.js (UI, pages)
├── app/                         
│   ├── (auth)/                  → UI Pages: /login, /signup, /verify-otp
│   ├── api/                     → Backend Endpoints: /api/auth/login, etc.
│   ├── admin/                   → UI Pages for Admins
│   ├── dashboard/               → UI Pages for Users
│   ├── page.js                  → Home Page (/)
│   └── layout.js                → Root HTML wrapper
│
├── components/                  ← Dashboard-specific widgets
│   ├── adminDashboard/          
│   │   ├── AdminPage.js         → /admin page (users & access control)
│   │   ├── AdminStats.js        → Approval stats chart
│   │   ├── InfoCard.js          → Stat card (Total Users, Pending, etc.)
│   │   ├── ProductsPage.js      → /admin/products page
│   │   └── ThemeProvider.js     → Dark/light mode toggle
│   │
│   └── userDashboard/           
│       ├── DashboardCards.js    → Quick action cards
│       ├── DashboardHeader.js   → Welcome banner
│       ├── DashboardPage.js     → /dashboard main content
│       ├── DashboardRoute.js    → Auth check + layout for /dashboard
│       ├── ProductList.js       → Product list view
│       ├── ProductsPage.js      → /dashboard/products page
│       └── SearchBar.js         → Search input
│
├── forms/                       ← All Form Components
│   ├── AuthForm.js              → Login & Signup form
│   ├── OtpForm.js               → OTP verification form
│   └── ProductRegistrationForm.js → Product registration form
│
├── layouts/                     ← Used on EVERY page
│   ├── MainLayout.js            → Navbar + Sidebar + content wrapper
│   ├── Navbar.js                → Top navigation bar
│   └── Sidebar.js               → Left sidebar menu
│
├── tables/                      ← Data Tables
│   ├── adminTables/             → Tables for the admin panel
│   └── userTables/              → Tables for the user dashboard
│
├── ui/                          ← Small reusable pieces
│   └── Alert.js, Button.js, ErrorBox.js, Input.js, Loader.js, ThemeToggle.js
│
├── styles/globals.css           → Global CSS
├── middleware.js                → Protects logged-in routes
└── next.config.js               → Next.js configuration
```

### 2. `backend/` — Server Logic
```text
backend/                         ← The hidden server logic
├── controllers/                 ← STEP 1: Handle request & response
│   ├── authController.js        → Login, signup, OTP, logout logic
│   ├── adminController.js       → Approve users, manage products
│   ├── productController.js     → Register & fetch products
│   ├── uploadController.js      → File uploads (images)
│   └── userController.js        → Get user info
│
├── services/                    ← STEP 2: Business logic + talk to DB
│   ├── authService.js           → Password hashing, token creation
│   ├── emailService.js          → Send OTP emails
│   ├── productService.js        → Create/read products from DB
│   ├── uploadService.js         → Upload images to Cloudinary
│   └── userService.js           → Read/update users from DB
│
├── database/                    ← STEP 3: MongoDB Connection & Models
│   ├── connection/db.js         → Connects to MongoDB
│   └── models/                  → User.js, Product.js
│
├── config/                      → Cloudinary & Email setups
├── middleware/routeGuards.js    → Backend API protection
├── scripts/seedAdmin.js         → Run once to create the first admin
└── utils/                       → Helpers (auth tokens, OTP generator)
```

### 3. Other Files (Project Root)
```text
(Project Root)
├── .env.local                   → Secret keys (DB URL, JWT)
├── .gitignore                   → Files/folders Git should ignore
├── package-lock.json            → Exact dependency versions
└── package.json                 → Run scripts (npm run dev) & workspace config
```

---

## 🚀 Quick Reference: URL → Component

| URL | What It Shows | Main Component |
|---|---|---|
| `/login` | Login form | `frontend/forms/AuthForm.js` |
| `/signup` | Signup form | `frontend/forms/AuthForm.js` |
| `/verify-otp` | OTP input | `frontend/forms/OtpForm.js` |
| `/dashboard` | User home | `frontend/components/userDashboard/DashboardPage.js` |
| `/dashboard/products` | My products | `frontend/components/userDashboard/ProductsPage.js` |
| `/dashboard/products/register` | Register product | `frontend/forms/ProductRegistrationForm.js` |
| `/admin` | Users & access | `frontend/components/adminDashboard/AdminPage.js` |
| `/admin/products` | All products | `frontend/components/adminDashboard/ProductsPage.js` |
