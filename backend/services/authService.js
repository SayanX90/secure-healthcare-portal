import { connectDB } from "@/backend/database/connection/db";
import { createOtpExpiry, generateOtp as createOtp } from "@/backend/utils/otp";
import { AUTH_COOKIE, cleanUser, cookieSettings, createToken } from "@/backend/utils/auth";
import User from "@/backend/database/models/User";
import GeneratedOtp from "@/backend/database/models/GeneratedOtp";

// ─── Generate OTP ─────────────────────────────────────────────────────────────
export async function generateOtp({ phone, countryCode = "+91" }) {
  await connectDB();

  // Validate Indian phone number (10 digits)
  if (!/^\d{10}$/.test(phone)) {
    const err = new Error("Invalid phone number. Must be 10 digits.");
    err.status = 400;
    throw err;
  }

  // ONE OTP PER PHONE: Before creating a new OTP, delete any existing
  // OTP records for this phone number. This ensures only ONE OTP document
  // exists per phone — whether it's a first login, re-login, or resend.
  await GeneratedOtp.deleteMany({ phone, countryCode });

  // Generate 4 digit OTP and 2 minute expiry
  const otp = createOtp();
  const expiresAt = createOtpExpiry();

  // Save the single new OTP to MongoDB
  await GeneratedOtp.create({
    phone,
    countryCode,
    otp,
    expiresAt,
  });

  // DO NOT integrate SMS gateway here as requested.
  console.log(`[TESTING ONLY] OTP for ${countryCode} ${phone}: ${otp}`);

  // Return expiresAt so the frontend can sync its countdown timer to the server clock
  return { success: true, message: "OTP sent successfully.", expiresAt };
}

// ─── Verify OTP ───────────────────────────────────────────────────────────────
export async function verifyOtp({ phone, countryCode = "+91", otp }) {
  await connectDB();

  // STEP 1: Find OTP document by phone number
  const latestOtpRecord = await GeneratedOtp.findOne({
    phone,
    countryCode,
    verified: false
  }).sort({ createdAt: -1 });

  if (!latestOtpRecord) {
    const err = new Error("OTP expired. Please resend OTP.");
    err.status = 400;
    throw err;
  }

  // STEP 2: Check if entered OTP matches database OTP
  if (latestOtpRecord.otp !== otp) {
    const err = new Error("OTP mismatch");
    err.status = 400;
    throw err;
  }

  // STEP 3: ONLY AFTER OTP MATCHES, check expiration time
  if (latestOtpRecord.expiresAt < new Date()) {
    const err = new Error("OTP expired. Please resend OTP.");
    err.status = 400;
    throw err;
  }

  // Mark OTP as verified to prevent reuse, but keep the record.
  // IMPORTANT: We do NOT delete the OTP record here.
  // OTP records are preserved in generatedotps after verification and sign-out.
  // Only the "Resend OTP" flow (resendOtp function below) deletes old records.
  latestOtpRecord.verified = true;
  await latestOtpRecord.save();

  // Find user by phone, or create if doesn't exist
  let user = await User.findOne({ phone, countryCode });
  let isNewUser = false;

  if (!user) {
    // Brand new user — will be sent to /profile to complete their details
    isNewUser = true;
    user = await User.create({
      phone,
      countryCode,
      name: "User",
      role: "user",
      isVerified: true,
      isApproved: true,
    });
  }

  const safeUser = cleanUser(user);
  const token = await createToken(safeUser);

  // Return profileCompleted so frontend can decide:
  //   existing user with completed profile → dashboard
  //   existing user without completed profile → profile page
  //   new user → profile page
  return { success: true, safeUser, token, isNewUser, message: "Logged in successfully." };
}

// ─── Resend OTP ───────────────────────────────────────────────────────────────
export async function resendOtp({ phone, countryCode = "+91" }) {
  // generateOtp already handles deleting old records and creating a new one,
  // so resend simply calls generateOtp — no extra cleanup needed here.
  return generateOtp({ phone, countryCode });
}
