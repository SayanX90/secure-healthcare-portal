import { NextResponse } from "next/server";
import { connectDB } from "@/backend/database/connection/db";
import GeneratedOtp from "@/backend/database/models/GeneratedOtp";

// TEMPORARY: OTP preview enabled on all environments for testing.
// TODO: Re-enable production guard after SMS gateway integration.
export async function GET(req) {

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
