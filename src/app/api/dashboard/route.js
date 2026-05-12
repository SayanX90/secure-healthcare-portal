import { NextResponse } from "next/server";
import { requireAuth } from "@/backend/middleware/routeGuards";

export async function GET() {
  const { user, response } = await requireAuth();
  if (response) return response;
  return NextResponse.json({ user, stats: { session: "Active", access: "Protected" } });
}
