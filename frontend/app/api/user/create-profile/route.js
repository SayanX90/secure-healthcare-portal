import { NextResponse } from "next/server";
import { connectDB } from "@/backend/database/connection/db";
import User from "@/backend/database/models/User";
import { getCurrentUser } from "@/backend/utils/session";
import { createToken, cookieSettings, AUTH_COOKIE, cleanUser } from "@/backend/utils/auth";

export async function POST(request) {
  try {
    const userSession = await getCurrentUser();

    if (!userSession) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { name, gender, age, address, profileImage } = await request.json();

    if (!name || !gender || !age || !address) {
      return NextResponse.json({ message: "Please provide all required fields." }, { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findByIdAndUpdate(
      userSession.id,
      {
        name,
        gender,
        age: Number(age),
        address,
        profileImage: profileImage || "",
        profileCompleted: true,
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    // Generate a fresh token with updated details (like name and profileCompleted status)
    const safeUser = cleanUser(updatedUser);
    const token = await createToken(safeUser);

    const response = NextResponse.json(
      { success: true, message: "Profile updated successfully.", user: safeUser },
      { status: 200 }
    );
    response.cookies.set(AUTH_COOKIE, token, cookieSettings());

    return response;

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
