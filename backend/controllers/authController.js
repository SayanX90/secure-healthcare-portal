"use server";

import { NextResponse } from "next/server";
import { generateOtp, verifyOtp, resendOtp } from "@/backend/services/authService";
import { AUTH_COOKIE, cookieSettings } from "@/backend/utils/auth";
import { getCurrentUser } from "@/backend/utils/session";

// ─── POST /api/auth/send-otp ──────────────────────────────────────────────────
export async function sendOtpHandler(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ message: "Phone number is required." }, { status: 400 });
    }

    const result = await generateOtp({ phone, countryCode: "+91" });
    return NextResponse.json({ success: true, message: result.message }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message || "Unable to send OTP." }, { status: error.status || 500 });
  }
}

// ─── POST /api/auth/verify-otp ───────────────────────────────────────────────
export async function verifyOtpHandler(request) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json({ message: "Phone and OTP are required." }, { status: 400 });
    }

    const { safeUser, token, isNewUser, message } = await verifyOtp({ phone, countryCode: "+91", otp });

    const response = NextResponse.json({ success: true, message, user: safeUser, isNewUser }, { status: 200 });
    response.cookies.set(AUTH_COOKIE, token, cookieSettings());
    return response;

  } catch (error) {
    return NextResponse.json({ message: error.message || "Unable to verify OTP." }, { status: error.status || 500 });
  }
}

// ─── POST /api/auth/resend-otp ───────────────────────────────────────────────
export async function resendOtpHandler(request) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json({ message: "Phone number is required." }, { status: 400 });
    }

    const result = await resendOtp({ phone, countryCode: "+91" });
    return NextResponse.json({ success: true, message: result.message }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: error.message || "Unable to resend OTP." }, { status: error.status || 500 });
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
