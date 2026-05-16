import { NextResponse } from "next/server";
import { getCurrentUser } from "@/backend/utils/session";

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  return { user, response: null };
}

export async function requireAdmin() {
  const { user, response } = await requireAuth();

  if (response) {
    return { user: null, response };
  }

  if (user.role !== "admin") {
    return {
      user: null,
      response: NextResponse.json({ message: "Forbidden" }, { status: 403 }),
    };
  }

  return { user, response: null };
}
