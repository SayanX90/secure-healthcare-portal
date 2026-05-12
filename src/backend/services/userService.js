import { connectDB } from "@/database/connection/db";
import User from "@/database/models/User";

// Business logic file for admin user management.

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
export async function getAllUsers() {
  await connectDB();
  const users = await User.find({})
    .sort({ createdAt: -1 })
    .select("name email role isVerified isApproved createdAt")
    .lean();

  return users.map((user) => ({ ...user, _id: user._id.toString() }));
}

// ─── Approve User (Admin) ─────────────────────────────────────────────────────
export async function approveUser(id) {
  await connectDB();
  const user = await User.findByIdAndUpdate(
    id,
    { $set: { isApproved: true } },
    { new: true }
  ).select("name email role isVerified isApproved createdAt");

  if (!user) {
    const err = new Error("User not found."); err.status = 404; throw err;
  }

  return user;
}

// ─── Delete User (Admin) ──────────────────────────────────────────────────────
export async function deleteUser(id, adminId) {
  if (adminId === id) {
    const err = new Error("You cannot delete your own admin account."); err.status = 400; throw err;
  }

  await connectDB();
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    const err = new Error("User not found."); err.status = 404; throw err;
  }

  return { success: true, message: "User deleted." };
}
