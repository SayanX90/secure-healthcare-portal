import { NextResponse } from "next/server";
import { requireAuth } from "@/backend/middleware/routeGuards";
import { handleFileUploads } from "@/backend/services/uploadService";

// ─── POST /api/upload ─────────────────────────────────────────────────────────
export async function uploadHandler(request) {
  try {
    const { user, response: authError } = await requireAuth();
    if (authError) return authError;

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ message: "Invalid request. Expected multipart/form-data." }, { status: 400 });
    }

    const urls = await handleFileUploads(formData, user.id);
    return NextResponse.json({ message: "Files uploaded successfully.", urls }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/upload]", error);
    return NextResponse.json({ message: error.message || "File upload failed." }, { status: error.status || 500 });
  }
}
