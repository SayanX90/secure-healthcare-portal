import { NextResponse } from "next/server";
import { connectDB } from "@/backend/database/connection/db";
import { requireAuth } from "@/backend/middleware/routeGuards";
import BookService from "@/backend/database/models/BookService";
import Product from "@/backend/database/models/Product"; // Needed for .populate("productId")

// GET /api/requests/my
// Returns all service requests belonging to the logged-in user.
export async function GET() {
  try {
    const { user, response: authError } = await requireAuth();
    if (authError) return authError;

    await connectDB();

    // Fetch all service requests for this user, newest first.
    // Populate productId so we can display the product name.
    const requests = await BookService.find({ userId: user.id })
      .populate("productId", "productName productModel")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ requests }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/requests/my]", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch requests." },
      { status: 500 }
    );
  }
}
