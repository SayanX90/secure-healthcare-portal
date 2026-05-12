import { NextResponse } from "next/server";
import { getAllUsers, approveUser, deleteUser } from "@/backend/services/userService";
import { requireAdmin } from "@/backend/middleware/routeGuards";

// ─── GET /api/users | /api/admin/users ────────────────────────────────────────
export async function getUsersHandler() {
  const { response } = await requireAdmin();
  if (response) return response;

  const users = await getAllUsers();
  return NextResponse.json({ users });
}

// ─── PATCH /api/admin/approve/[id] ───────────────────────────────────────────
export async function approveUserHandler(id) {
  const { response } = await requireAdmin();
  if (response) return response;

  try {
    const user = await approveUser(id);
    return NextResponse.json({ success: true, message: "User approved.", user });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: error.status || 500 });
  }
}

// ─── DELETE /api/admin/users/[id] ────────────────────────────────────────────
export async function deleteUserHandler(id, adminId) {
  const { user: admin, response } = await requireAdmin();
  if (response) return response;

  try {
    const result = await deleteUser(id, admin.id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: error.status || 400 });
  }
}
