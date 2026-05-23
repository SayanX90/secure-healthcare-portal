import { NextResponse } from "next/server";
import { registerProduct, getMyProducts, getAllProducts, updateProductStatus } from "@/backend/services/productService";
import { requireAuth, requireAdmin } from "@/backend/middleware/routeGuards";
// Controller file: handles requests and calls product services.

// ─── POST /api/products/register ─────────────────────────────────────────────
export async function registerProductHandler(request) {
  try {
    const { user, response: authError } = await requireAuth();
    if (authError) return authError;

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ message: "Invalid request format. Expected JSON." }, { status: 400 });
    }

    const product = await registerProduct(body, user.id);
    return NextResponse.json({ message: "Product registered successfully.", product }, { status: 201 });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json({ message: messages[0] || "Validation failed.", errors: messages }, { status: 400 });
    }
    if (error.missing) {
      return NextResponse.json({ message: error.message, missing: error.missing }, { status: 400 });
    }
    return NextResponse.json({ message: error.message || "Internal server error." }, { status: error.status || 500 });
  }
}

// ─── GET /api/products/my ─────────────────────────────────────────────────────
export async function getMyProductsHandler() {
  try {
    const { user, response: authError } = await requireAuth();
    if (authError) return authError;
    const products = await getMyProducts(user.id);
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ message: "Unable to fetch products." }, { status: 500 });
  }
}

// ─── GET /api/admin/products ──────────────────────────────────────────────────
export async function getAllProductsHandler() {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;
    const products = await getAllProducts();
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ message: "Unable to fetch products." }, { status: 500 });
  }
}

// ─── PATCH /api/admin/products/[id] ──────────────────────────────────────────
export async function updateProductStatusHandler(request, id) {
  try {
    const { response: authError } = await requireAdmin();
    if (authError) return authError;

    const body = await request.json();
    const { status } = body;

    const { updated, product } = await updateProductStatus(id, status);

    // Email notification removed as requested

    return NextResponse.json({ message: `Product successfully ${status}.`, product: updated });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Unable to update product status." }, { status: error.status || 500 });
  }
}
