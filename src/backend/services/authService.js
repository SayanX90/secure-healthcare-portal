import bcrypt from "bcryptjs";
import { connectDB } from "@/database/connection/db";
import { createOtpExpiry, generateOtp } from "@/backend/utils/otp";
import { AUTH_COOKIE, cleanUser, cookieSettings, createToken } from "@/backend/utils/auth";
import { sendOtpEmail } from "@/backend/config/mailer";
import User from "@/database/models/User";

// Business logic file for auth: signup, login, and OTP verification.

// ─── Signup ───────────────────────────────────────────────────────────────────
export async function signupUser({ name, email, password }) {
  await connectDB();

  const normalizedEmail = email.toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const err = new Error("Email already exists.");
    err.status = 409;
    throw err;
  }

  const otp = generateOtp();
  const hashedPassword = await bcrypt.hash(password, 12);
  const legacyUsernamePrefix =
    normalizedEmail.split("@")[0].replace(/[^a-z0-9]/g, "").slice(0, 20) || "user";
  const legacyUsername = `${legacyUsernamePrefix}${Date.now().toString(36).slice(-8)}`;

  await User.create({
    name,
    username: legacyUsername,
    email: normalizedEmail,
    password: hashedPassword,
    otp,
    otpExpiry: createOtpExpiry(),
    isVerified: false,
    isApproved: false,
    role: "user",
  });

  await sendOtpEmail({ to: normalizedEmail, name, otp });

  return { success: true, message: "Account created successfully. Please verify your email." };
}

// ─── Login ────────────────────────────────────────────────────────────────────
export async function loginUser({ email, password }) {
  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
  if (!user) {
    const err = new Error("Invalid email or password.");
    err.status = 401;
    throw err;
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    const err = new Error("Invalid email or password.");
    err.status = 401;
    throw err;
  }

  if (!user.isVerified) {
    const err = new Error("Verify your email before logging in.");
    err.status = 403;
    throw err;
  }

  if (!user.isApproved) {
    const err = new Error("Waiting for admin approval.");
    err.status = 403;
    throw err;
  }

  const safeUser = cleanUser(user);
  const token = await createToken(safeUser);

  return { safeUser, token };
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export async function verifyOtp({ email, otp }) {
  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() }).select("+otp +otpExpiry");
  if (!user) {
    const err = new Error("User not found.");
    err.status = 404;
    throw err;
  }

  if (user.isVerified) {
    return { success: true, message: "Email already verified." };
  }

  if (!user.otp || !user.otpExpiry || user.otpExpiry.getTime() < Date.now()) {
    const err = new Error("OTP expired. Please sign up again or request a new OTP.");
    err.status = 400;
    throw err;
  }

  if (user.otp !== otp) {
    const err = new Error("Invalid OTP.");
    err.status = 400;
    throw err;
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  return { success: true, message: "Email verified successfully. Waiting for admin approval." };
}
