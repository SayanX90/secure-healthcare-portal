import { NextResponse } from "next/server";
import { connectDB } from "@/backend/database/connection/db";
import GeneratedOtp from "@/backend/database/models/GeneratedOtp";

// ─── GET /api/auth/testing-otp?phone=XXXXXXXXXX ──────────────────────────────
// DEV-ONLY endpoint: Returns the latest OTP for a phone number so testers
// can verify without checking MongoDB directly.
// Automatically disabled in production via NODE_ENV check.
export async function GET(req) {
  // Block in production — this endpoint must NEVER be accessible in prod
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ message: "Not available." }, { status: 404 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json({ message: "Phone is required." }, { status: 400 });
    }

    await connectDB();

    const record = await GeneratedOtp.findOne({
      phone,
      countryCode: "+91",
      verified: false,
    }).sort({ createdAt: -1 });

    if (!record) {
      return NextResponse.json({ otp: null }, { status: 200 });
    }

    return NextResponse.json({ otp: record.otp }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch OTP." }, { status: 500 });
  }
}
