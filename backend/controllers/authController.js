"use server";

import { NextResponse } from "next/server";
import { signupUser, loginUser, verifyOtp } from "@/backend/services/authService";
import { AUTH_COOKIE, cookieSettings } from "@/backend/utils/auth";
import { getCurrentUser } from "@/backend/utils/session";

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
export async function signup(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password)
      return NextResponse.json({ message: "Name, email, and password are required." }, { status: 400 });

    if (password.length < 8)
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });

    const result = await signupUser({ name, email, password });
    return NextResponse.json({ success: true, message: result.message }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: error.message || "Unable to create account." }, { status: error.status || 500 });
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export async function login(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password)
      return NextResponse.json({ message: "Email and password are required." }, { status: 400 });

    const { safeUser, token } = await loginUser({ email, password });

    const response = NextResponse.json({ user: safeUser });
    response.cookies.set(AUTH_COOKIE, token, cookieSettings());
    return response;

  } catch (error) {
    return NextResponse.json({ message: error.message || "Unable to log in." }, { status: error.status || 500 });
  }
}

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export async function logout() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export async function me() {
  const user = await getCurrentUser();

  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ user });
}

// ─── POST /api/auth/verify-otp ───────────────────────────────────────────────
export async function verifyOtpHandler(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp)
      return NextResponse.json({ message: "Email and OTP are required." }, { status: 400 });

    const result = await verifyOtp({ email, otp });
    return NextResponse.json({ success: true, message: result.message });

  } catch (error) {
    return NextResponse.json({ message: error.message || "Unable to verify OTP." }, { status: error.status || 500 });
  }
}
