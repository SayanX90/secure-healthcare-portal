# Home Healthcare Services — Project Structure

This project has **4 main folders** inside `src/`. Each folder has one job:

```
src/
├── app/          ← URLs & API routes  (what the browser hits)
├── frontend/     ← UI components      (what the user sees)
├── backend/      ← Server logic       (what handles the data)
└── database/     ← DB connection      (where data is stored)
```

---

## How They Connect

```
User visits a URL
       ↓
  app/  (picks the right page)
       ↓
  frontend/  (renders the UI)
       ↓
  User clicks a button (e.g. Login, Approve, Delete)
       ↓
  app/api/  (API route receives the request)
       ↓
  backend/controllers/  (validates & processes the request)
       ↓
  backend/services/  (talks to the database)
       ↓
  database/models/  (reads/writes data in MongoDB)
```

---

## 1. `app/` — Pages & API Routes

This folder controls **what URL shows what page** and **what API endpoints exist**.

### Pages (what the user sees in the browser)

```
app/
├── page.js                          →  /                           (Home page)
├── layout.js                        →  Root HTML wrapper
├── error.js                         →  Error screen
├── loading.js                       →  Loading spinner
│
├── (auth)/                          →  Auth pages (no URL prefix)
│   ├── login/page.js                →  /login
│   ├── signup/page.js               →  /signup
│   └── verify-otp/page.js           →  /verify-otp
│
├── admin/                           →  Admin-only pages
│   ├── page.js                      →  /admin
│   ├── loading.js
│   └── products/page.js             →  /admin/products
│
└── dashboard/                       →  User dashboard pages
    ├── page.js                      →  /dashboard
    ├── loading.js
    └── products/
        ├── page.js                  →  /dashboard/products
        └── register/page.js         →  /dashboard/products/register
```

### API Routes (what the frontend calls when user takes action)

```
app/api/
├── auth/
│   ├── login/route.js               →  POST   /api/auth/login
│   ├── signup/route.js              →  POST   /api/auth/signup
│   ├── logout/route.js              →  POST   /api/auth/logout
│   ├── verify-otp/route.js          →  POST   /api/auth/verify-otp
│   └── me/route.js                  →  GET    /api/auth/me
│
├── admin/
│   ├── route.js                     →  GET    /api/admin
│   ├── approve/[id]/route.js        →  PATCH  /api/admin/approve/:id
│   ├── users/route.js               →  GET    /api/admin/users
│   ├── users/[id]/route.js          →  DELETE /api/admin/users/:id
│   ├── products/route.js            →  GET    /api/admin/products
│   └── products/[id]/route.js       →  PATCH  /api/admin/products/:id
│
├── products/
│   ├── my/route.js                  →  GET    /api/products/my
│   └── register/route.js            →  POST   /api/products/register
│
├── dashboard/route.js               →  GET    /api/dashboard
├── upload/route.js                  →  POST   /api/upload
└── users/route.js                   →  GET    /api/users
```

---

## 2. `frontend/` — UI Components

Everything the user **sees and interacts with**. Organized by feature area:

```
frontend/
├── components/
│   │
│   ├── layouts/                     ← Used on EVERY page
│   │   ├── MainLayout.js            →  Navbar + Sidebar + content area wrapper
│   │   ├── Navbar.js                →  Top navigation bar
│   │   └── Sidebar.js               →  Left sidebar menu
│   │
│   ├── adminDashboard/              ← Admin-only pages & widgets
│   │   ├── AdminPage.js             →  /admin page (users & access control)
│   │   ├── AdminStats.js            →  Approval stats chart
│   │   ├── InfoCard.js              →  Stat card (Total Users, Pending, etc.)
│   │   ├── ProductsPage.js          →  /admin/products page
│   │   └── ThemeProvider.js         →  Dark/light mode toggle
│   │
│   ├── userDashboard/               ← Regular user pages & widgets
│   │   ├── DashboardPage.js         →  /dashboard main content
│   │   ├── DashboardRoute.js        →  Auth check + layout for /dashboard
│   │   ├── DashboardHeader.js       →  Welcome banner
│   │   ├── DashboardCards.js        →  Quick action cards
│   │   ├── ProductsPage.js          →  /dashboard/products page
│   │   ├── ProductList.js           →  Product list view
│   │   └── SearchBar.js             →  Search input
│   │
│   ├── forms/                       ← All form components
│   │   ├── AuthForm.js              →  Login & Signup form
│   │   ├── OtpForm.js               →  OTP verification form
│   │   └── ProductRegistrationForm.js → Product registration form
│   │
│   ├── tables/                      ← Data tables (split by admin vs user)
│   │   │
│   │   ├── adminTables/             ← Tables on the admin panel
│   │   │   ├── UsersTable.js        →  Full users table + modal + actions
│   │   │   ├── UserRow.js           →  One row (avatar, name, role, status)
│   │   │   ├── UserFilters.js       →  Search + role/status dropdowns
│   │   │   └── UserPagination.js    →  Prev/Next page buttons
│   │   │
│   │   └── userTables/              ← Tables on the user dashboard
│   │       ├── ProductsTable.js     →  Full products table
│   │       ├── ProductRow.js        →  One product row
│   │       ├── ProductFilters.js    →  Search + status/date filters
│   │       └── ProductPagination.js →  Prev/Next page buttons
│   │
│   └── ui/                          ← Small reusable pieces (used everywhere)
│       ├── Alert.js
│       ├── Button.js
│       ├── ErrorBox.js
│       ├── Input.js
│       ├── Loader.js
│       └── ThemeToggle.js
│
└── styles/
    └── globals.css                  →  Global CSS styles
```

---

## 3. `backend/` — Server Logic

Handles **all business logic**. No UI code here. Three layers:

```
backend/
├── controllers/                     ← STEP 1: Receive request, send response
│   ├── authController.js            →  Login, signup, OTP, logout
│   ├── adminController.js           →  Approve users, manage products
│   ├── productController.js         →  Register & fetch products
│   ├── uploadController.js          →  File uploads (images)
│   └── userController.js            →  Get user info
│
├── services/                        ← STEP 2: Business logic + talk to DB
│   ├── authService.js               →  Password hashing, token creation
│   ├── emailService.js              →  Send OTP emails
│   ├── productService.js            →  Create/read products from DB
│   ├── uploadService.js             →  Upload images to Cloudinary
│   └── userService.js               →  Read/update users from DB
│
├── middleware/
│   └── routeGuards.js               →  Check if user is logged in before proceeding
│
├── config/
│   ├── cloudinary.js                →  Cloudinary setup (image hosting)
│   └── mailer.js                    →  Nodemailer setup (sending emails)
│
└── utils/                           ← Small helpers
    ├── auth.js                      →  JWT token helpers
    ├── session.js                   →  Get current logged-in user
    ├── otp.js                       →  Generate OTP codes
    └── emailTemplates.js            →  HTML templates for emails
```

**How a request flows through the backend:**

```
API Route  →  Controller (validate)  →  Service (do the work)  →  Database
```

---

## 4. `database/` — MongoDB Connection & Models

```
database/
├── connection/
│   └── db.js                        →  Connects to MongoDB (runs once)
│
└── models/
    ├── User.js                      →  User schema (name, email, password, role, isApproved...)
    └── Product.js                   →  Product schema (name, status, userId, images...)
```

---

## Other Files

```
scripts/
└── seedAdmin.js                     →  Run once to create the first admin user

src/middleware.js                     →  Runs on EVERY request to protect routes

.env.local                           →  Secret keys (DB URL, JWT secret, Cloudinary keys)
jsconfig.json                        →  Path aliases (@/frontend/..., @/backend/...)
next.config.js                       →  Next.js config
tailwind.config.js                   →  Tailwind CSS config
package.json                         →  Dependencies & scripts
```

---

## Quick Reference: URL → Component

| URL | What It Shows | Main Component |
|---|---|---|
| `/login` | Login form | `forms/AuthForm.js` |
| `/signup` | Signup form | `forms/AuthForm.js` |
| `/verify-otp` | OTP input | `forms/OtpForm.js` |
| `/dashboard` | User home | `userDashboard/DashboardPage.js` |
| `/dashboard/products` | My products | `userDashboard/ProductsPage.js` |
| `/dashboard/products/register` | Register product | `forms/ProductRegistrationForm.js` |
| `/admin` | Users & access | `adminDashboard/AdminPage.js` |
| `/admin/products` | All products | `adminDashboard/ProductsPage.js` |
