"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Clock, Shield, Trash2, X, AlertCircle } from "lucide-react";

// These are smaller components that live in their own files.
// We import them here so we can use them inside this file.
import UserRow, { Badge, Avatar } from "./UserRow";
import UserFilters from "./UserFilters";
import UserPagination from "./UserPagination";


// ─────────────────────────────────────────────────────────────────────────────
// USER MODAL — The popup that appears when you click on a user row.
// It shows the user's full details and gives the admin action buttons
// (Approve / Delete).
// ─────────────────────────────────────────────────────────────────────────────
function UserModal({ user, isOpen, onClose, onApprove, onDelete, isBusy, currentUser }) {

  // If the modal is not open or no user is selected, don't render anything.
  if (!isOpen || !user) return null;

  // Check if the selected user is the admin themselves.
  // We use this to hide the "Delete" button (admin can't delete themselves).
  const isSelf = user._id.toString() === currentUser?.id;

  return (
    // Dark overlay behind the modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* The white modal box */}
      <div className="w-full max-w-lg rounded-2xl bg-card p-4 sm:p-6 shadow-xl border border-border relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

        {/* ── Close Button (top-right X icon) ── */}
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <X className="h-5 w-5" />
        </button>

        {/* ── Header: Avatar + Name + Phone ── */}
        <div className="flex items-center gap-4 border-b border-border pb-6">
          {/* Circle with the user's initials (e.g. "SD" for "Sayan Dey") */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              {user.name}{" "}
              {/* If this user is the currently logged-in admin, show a "You" tag */}
              {isSelf && (
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
                  You
                </span>
              )}
            </h3>
            <p className="text-sm text-muted">{user.phone}</p>
          </div>
        </div>

        {/* ── Detail Grid: Role, Status, Email Verified, Joined Date ── */}
        <div className="py-6 grid grid-cols-2 gap-4">
          {/* Role */}
          <div>
            <p className="text-xs font-medium text-muted tracking-wider mb-1 uppercase">Role</p>
            <Badge color={user.role === "admin" ? "purple" : "slate"} icon={user.role === "admin" ? Shield : null}>
              {user.role === "admin" ? "Admin" : "User"}
            </Badge>
          </div>
          {/* Status */}
          <div>
            <p className="text-xs font-medium text-muted tracking-wider mb-1 uppercase">Status</p>
            <Badge color={user.isApproved ? "green" : "yellow"} icon={user.isApproved ? CheckCircle2 : Clock}>
              {user.isApproved ? "Approved" : "Pending"}
            </Badge>
          </div>
          {/* Phone Verified */}
          <div>
            <p className="text-xs font-medium text-muted tracking-wider mb-1 uppercase">Phone Verified</p>
            <span className={`text-sm font-semibold ${user.isVerified ? "text-success" : "text-red-500 dark:text-red-400"}`}>
              {user.isVerified ? "Yes" : "No"}
            </span>
          </div>
          {/* Joined Date */}
          <div>
            <p className="text-xs font-medium text-muted tracking-wider mb-1 uppercase">Joined Date</p>
            <p className="text-sm font-medium text-foreground">
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* ── Action Buttons: Approve & Delete ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border w-full">

          {/* Show "Approve" button ONLY if user is NOT already approved AND is not an admin */}
          {!user.isApproved && user.role !== "admin" && (
            <button
              disabled={isBusy}
              onClick={() => onApprove(user._id.toString())}
              className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 py-2.5 text-sm font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" /> Approve User
            </button>
          )}

          {/* Show "Delete" button ONLY if the user is NOT the admin themselves */}
          {!isSelf && (
            <button
              disabled={isBusy}
              onClick={() => onDelete(user._id.toString())}
              className="flex-1 w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-red-200 dark:border-red-500/30 bg-red-500/10 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 transition-all hover:bg-red-500/20 active:scale-[0.98] disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" /> Delete Account
            </button>
          )}

        </div>
      </div>
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────────────────
// USERS TABLE — The main component that shows the admin users table.
//
// HOW IT WORKS:
//   1. It receives all users from AdminPage.js (server component).
//   2. It stores them in state so we can filter/search/paginate on the client.
//   3. When admin clicks a row → opens a modal with user details.
//   4. Admin can Approve or Delete a user from the modal.
//
// Props:
//   - users (array)       → all users from the database
//   - currentUser (object) → the currently logged-in admin
// ─────────────────────────────────────────────────────────────────────────────
export default function UsersTable({ users: initialUsers, currentUser }) {

  // useRouter lets us refresh the page data after an action (approve/delete).
  const router = useRouter();

  // ── STEP 1: Set Up All the State Variables ──
  // These are the "memory" of this component. React re-renders the UI
  // every time any of these values change.

  const [users, setUsers] = useState(initialUsers);
  const [busyId, setBusyId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  // How many users to show per page
  const itemsPerPage = 10;


  // ── STEP 2: Filter the Users ──
  // Every time search/role/status changes, this runs automatically.
  // It takes ALL users and keeps only the ones that match ALL filters.
  const filteredUsers = users.filter((user) => {
    const text = searchQuery.toLowerCase();

    // Does the user's name or phone contain the search text?
    const matchesSearch =
      user.name.toLowerCase().includes(text) ||
      user.phone.toLowerCase().includes(text);

    // Does the user's role match the dropdown? ("all" means show everyone)
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    // Does the user's status match the dropdown?
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && user.isApproved) ||
      (statusFilter === "pending" && !user.isApproved);

    // Only keep users that pass ALL three checks
    return matchesSearch && matchesRole && matchesStatus;
  });


  // ── STEP 3: Paginate the Filtered Users ──
  // If we have 25 filtered users and show 10 per page, we get 3 pages.
  // We "slice" only the 10 users for the current page.
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  // ── Helper: Reset to Page 1 ──
  // When the admin changes a filter, we go back to page 1
  // (otherwise they might be on page 3 of results that no longer exist).
  function resetPage() {
    setCurrentPage(1);
  }


  // ── STEP 4: Handle Approve / Delete Actions ──
  // This function is called when the admin clicks "Approve" or "Delete" in the modal.
  //   - action = "approve" → sends PATCH to /api/admin/approve/:id
  //   - action = "delete"  → sends DELETE to /api/admin/users/:id
  async function performAction(id, action) {
    // Mark this user as "busy" (disables buttons so admin can't double-click)
    setBusyId(id);

    // Pick the right URL and HTTP method based on the action
    const url = action === "approve"
      ? `/api/admin/approve/${id}`
      : `/api/admin/users/${id}`;
    const method = action === "approve" ? "PATCH" : "DELETE";

    try {
      // Send the request to the backend
      const res = await fetch(url, { method });
      const data = await res.json();

      // If the server returned an error, throw it
      if (!res.ok) {
        throw new Error(data.message || "Action failed");
      }

      // Show a success toast notification
      toast.success(data.message || "Success");

      if (action === "approve") {
        // Update the user's isApproved to true in our local state
        // (so the UI updates instantly without needing a full page reload)
        setUsers((prev) =>
          prev.map((u) => (u._id.toString() === id ? { ...u, isApproved: true } : u))
        );
        // Also update the modal if it's showing this user
        setSelectedUser((prev) =>
          prev && prev._id.toString() === id ? { ...prev, isApproved: true } : prev
        );
      } else {
        // Remove the deleted user from our local state
        setUsers((prev) => prev.filter((u) => u._id.toString() !== id));
        // Close the modal
        setSelectedUser(null);
      }

      // Tell Next.js to re-fetch the server data in the background
      router.refresh();

    } catch (err) {
      // Show an error toast if something went wrong
      toast.error(err.message || "Network error");
    } finally {
      // Clear the busy state (re-enables buttons)
      setBusyId("");
    }
  }


  // ── STEP 5: Render the UI ──
  return (
    <>
      {/* ── The User Detail Modal (hidden until a row is clicked) ── */}
      <UserModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onApprove={(id) => performAction(id, "approve")}
        onDelete={(id) => performAction(id, "delete")}
        isBusy={!!busyId}
        currentUser={currentUser}
      />

      {/* ── The Table Section ── */}
      <section className="mt-8 relative overflow-hidden rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card shadow-sm">

        {/* ── Search Bar + Dropdown Filters ── */}
        <UserFilters
          searchQuery={searchQuery}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onSearchChange={(val) => { setSearchQuery(val); resetPage(); }}
          onRoleChange={(val) => { setRoleFilter(val); resetPage(); }}
          onStatusChange={(val) => { setStatusFilter(val); resetPage(); }}
        />

        {/* ── Show "No users found" or the Table ── */}
        {filteredUsers.length === 0 ? (

          // Empty state: no users match the current filters
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 mb-4">
              <AlertCircle className="h-8 w-8 text-muted" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No users found</h3>
            <p className="mt-1 text-sm text-muted max-w-sm">
              We couldn&apos;t find any users matching your current search and filter criteria.
            </p>
          </div>

        ) : (
          <>
            {/* ── The Actual Table ── */}
            <div className="overflow-x-auto w-full max-h-[600px] bg-white dark:bg-card">
              <table className="w-full min-w-[600px] text-sm whitespace-nowrap">

                {/* Table header row: User | Role | Status | Joined */}
                <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-background border-b border-slate-200 dark:border-border shadow-sm">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-muted uppercase tracking-wider text-xs text-left">User</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-muted uppercase tracking-wider text-xs hidden sm:table-cell text-center">Role</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-muted uppercase tracking-wider text-xs text-center">Status</th>
                    <th className="px-6 py-4 font-bold text-slate-500 dark:text-muted uppercase tracking-wider text-xs hidden lg:table-cell text-center">Joined</th>
                  </tr>
                </thead>

                {/* Table body: one UserRow per user */}
                <tbody className="divide-y divide-border">
                  {paginatedUsers.map((user) => (
                    <UserRow
                      key={user._id.toString()}
                      user={user}
                      onSelect={setSelectedUser}
                    />
                  ))}
                </tbody>

              </table>
            </div>

            {/* ── Prev/Next Pagination Buttons ── */}
            <UserPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredUsers.length}
              itemsPerPage={itemsPerPage}
              onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
              onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            />
          </>
        )}

      </section>
    </>
  );
}
