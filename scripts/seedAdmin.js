/**
 *
 * What it does: Creates or updates the admin user in the database.
 * How to run:  npm run seed:admin
 *
 * Add these to your .env.local before running:
 *   MONGODB_URI      — your MongoDB connection string
 *   ADMIN_NAME       — admin's full name
 *   ADMIN_USERNAME   — admin's username
 *   ADMIN_EMAIL      — admin's email
 *   ADMIN_PASSWORD   — admin's password (min 8 characters)
 */

// ─── Imports ──────────────────────────────────────────────────────────────────

const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// ─── Step 1: Read .env.local ──────────────────────────────────────────────────
// Next.js only loads .env.local inside the app, not for scripts.
// So we read and load it ourselves here.

function loadEnvFile() {
  const filePath = path.join(process.cwd(), ".env.local");

  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const clean = line.trim();

    // Skip empty lines and comment lines
    if (!clean || clean.startsWith("#")) continue;

    // Each line is: KEY=VALUE
    const eqIndex = clean.indexOf("=");
    if (eqIndex === -1) continue;

    const key = clean.slice(0, eqIndex).trim();
    const value = clean.slice(eqIndex + 1).trim();

    // Only set if not already in the environment
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

// ─── Step 2: Get admin details from environment ───────────────────────────────

const dbUrl = process.env.MONGODB_URI;
const adminName = process.env.ADMIN_NAME;
const adminUsername = process.env.ADMIN_USERNAME;
const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

// Stop early if anything is missing
if (!dbUrl) {
  throw new Error("MONGODB_URI is missing. Check your .env.local file.");
}

if (!adminName || !adminUsername || !adminEmail || !adminPassword) {
  throw new Error("ADMIN_NAME, ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD are all required.");
}

if (adminPassword.length < 8) {
  throw new Error("ADMIN_PASSWORD must be at least 8 characters.");
}

// ─── Step 3: Define the User schema ──────────────────────────────────────────
// This must match the User model used in the rest of the app.

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true, minlength: 3, maxlength: 30 },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

// ─── Step 4: Connect, seed, disconnect ───────────────────────────────────────

async function seedAdmin() {
  // Connect to MongoDB
  await mongoose.connect(dbUrl);

  // Hash the password so it is never stored as plain text
  const safePassword = await bcrypt.hash(adminPassword, 12);
  const finalUsername = adminUsername.toLowerCase();
  const finalEmail = adminEmail.toLowerCase();

  // Find admin by email or username and update,
  // or create a new admin document if none exists (upsert).
  const admin = await User.findOneAndUpdate(
    {
      $or: [{ email: finalEmail }, { username: finalUsername }],
    },
    {
      $set: {
        name: adminName,
        username: finalUsername,
        email: finalEmail,
        password: safePassword,
        role: "admin",
        isVerified: true,
        isApproved: true,
        otp: undefined,
        otpExpiry: undefined,
      },
    },
    {
      new: true,                 // Return the updated document
      upsert: true,              // Create if not found
      runValidators: true,       // Apply schema rules on update
      setDefaultsOnInsert: true, // Apply defaults when inserting
    }
  );

  // Done — close connection and print result
  await mongoose.disconnect();
  console.log("✅ Admin ready:", admin.email);
}

seedAdmin().catch((err) => {
  console.error("❌ Seeding failed:", err.message);
  process.exit(1);
});