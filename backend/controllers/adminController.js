import { NextResponse } from "next/server";
import { requireAdmin } from "@/backend/middleware/routeGuards";

// ─── GET /api/admin ───────────────────────────────────────────────────────────
export async function adminCheckHandler() {
  const { user, response } = await requireAdmin();
  if (response) return response;
  return NextResponse.json({ message: "Admin access granted", user });
}
