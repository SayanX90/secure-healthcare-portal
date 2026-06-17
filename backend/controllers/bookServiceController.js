import { NextResponse } from "next/server";
import { requireAuth } from "@/backend/middleware/routeGuards";
import { createServiceRequest, handleProblemImageUploads } from "@/backend/services/serviceRequestService";
import { sendServiceRequestEmail } from "@/backend/services/email/sendServiceRequestEmail";

// Controller file: handles requests and calls book-service services.

// ─── POST /api/bookservice ────────────────────────────────────────────────────
export async function createBookServiceHandler(request) {
  try {
    const { user, response: authError } = await requireAuth();
    if (authError) return authError;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { message: "Invalid request format. Expected JSON." },
        { status: 400 }
      );
    }

    const serviceRequest = await createServiceRequest(body, user.id);
    
    if (user.personalEmail) {
      sendServiceRequestEmail(
        user.personalEmail,
        user.name,
        serviceRequest.productName,
        new Date(serviceRequest.createdAt).toLocaleDateString()
      ).catch((err) => console.error("Error sending service request email:", err));
    }

    return NextResponse.json(
      { message: "Service request created successfully.", serviceRequest },
      { status: 201 }
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { message: messages[0] || "Validation failed.", errors: messages },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Internal server error." },
      { status: error.status || 500 }
    );
  }
}

// ─── POST /api/upload/service-images ──────────────────────────────────────────
export async function uploadServiceImagesHandler(request) {
  try {
    const { user, response: authError } = await requireAuth();
    if (authError) return authError;

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json(
        { message: "Invalid request. Expected multipart/form-data." },
        { status: 400 }
      );
    }

    const urls = await handleProblemImageUploads(formData, user.id);
    return NextResponse.json(
      { message: "Images uploaded successfully.", urls },
      { status: 200 }
    );
  } catch (error) {
    console.error("[POST /api/upload/service-images]", error);
    return NextResponse.json(
      { message: error.message || "Image upload failed." },
      { status: error.status || 500 }
    );
  }
}
