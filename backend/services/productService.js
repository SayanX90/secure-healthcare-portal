import { connectDB } from "@/backend/database/connection/db";
import Product from "@/backend/database/models/Product";
import User from "@/backend/database/models/User";

// Business logic file for product registration and product status changes.

const REQUIRED_FIELDS = [
  "customerName", "customerAddress", "productName",
  "productModel", "quantity", "invoiceNumber",
  "warrantyFrom", "warrantyTo",
];

const isValidUrl = (url) => {
  try { return new URL(url).protocol === "https:"; } catch { return false; }
};

// ─── Register Product ─────────────────────────────────────────────────────────
export async function registerProduct(body, userId) {
  const fields = {
    customerName:    (body.customerName    || "").toString().trim(),
    customerAddress: (body.customerAddress || "").toString().trim(),
    productName:     (body.productName     || "").toString().trim(),
    productModel:    (body.productModel    || "").toString().trim(),
    quantity:        (body.quantity        || "").toString().trim(),
    invoiceNumber:   (body.invoiceNumber   || "").toString().trim(),
    suppliedBy:      (body.suppliedBy      || "").toString().trim(),
    installedBy:     (body.installedBy     || "").toString().trim(),
    warrantyFrom:    (body.warrantyFrom    || "").toString().trim(),
    warrantyTo:      (body.warrantyTo      || "").toString().trim(),
    salesPerson:     (body.salesPerson     || "").toString().trim(),
    remarks:         (body.remarks         || "").toString().trim(),
  };

  const serialNumbers = Array.isArray(body.serialNumbers)
    ? body.serialNumbers.map((s) => s.toString().trim()).filter(Boolean)
    : [];

  const installationCopyUrl    = (body.installationCopyUrl    || "").toString().trim();
  const invoiceCopyUrl         = (body.invoiceCopyUrl         || "").toString().trim();
  const installationPhotosUrls = Array.isArray(body.installationPhotosUrls)
    ? body.installationPhotosUrls.map((u) => u.toString().trim()).filter(Boolean)
    : [];

  // Validation
  const missing = REQUIRED_FIELDS.filter((f) => !fields[f]);
  if (missing.length > 0) {
    const err = new Error("Missing required fields.");
    err.status = 400;
    err.missing = missing.map((f) => ({
      field: f,
      label: f.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    }));
    throw err;
  }

  const quantity = parseInt(fields.quantity, 10);
  if (isNaN(quantity) || quantity < 1) {
    const err = new Error("Quantity must be a positive number."); err.status = 400; throw err;
  }
  if (!serialNumbers.length) {
    const err = new Error("Serial numbers are required."); err.status = 400; throw err;
  }
  if (serialNumbers.length !== quantity) {
    const err = new Error(`Number of serial numbers (${serialNumbers.length}) must match quantity (${quantity}).`);
    err.status = 400; throw err;
  }
  if (serialNumbers.some((s) => !s)) {
    const err = new Error("All serial number fields must be filled in."); err.status = 400; throw err;
  }

  const warrantyFrom = new Date(fields.warrantyFrom);
  const warrantyTo   = new Date(fields.warrantyTo);
  if (isNaN(warrantyFrom.getTime())) { const err = new Error("Invalid warranty start date."); err.status = 400; throw err; }
  if (isNaN(warrantyTo.getTime()))   { const err = new Error("Invalid warranty end date.");   err.status = 400; throw err; }
  if (warrantyTo <= warrantyFrom)    { const err = new Error("Warranty end date must be after the start date."); err.status = 400; throw err; }

  if (!installationCopyUrl) { const err = new Error("Installation copy upload is required."); err.status = 400; throw err; }
  if (!invoiceCopyUrl)      { const err = new Error("Invoice copy upload is required.");      err.status = 400; throw err; }
  if (!isValidUrl(installationCopyUrl)) { const err = new Error("Invalid installation copy URL."); err.status = 400; throw err; }
  if (!isValidUrl(invoiceCopyUrl))      { const err = new Error("Invalid invoice copy URL.");      err.status = 400; throw err; }

  await connectDB();

  const product = await Product.create({
    customerName:         fields.customerName,
    customerAddress:      fields.customerAddress,
    productName:          fields.productName,
    productModel:         fields.productModel,
    quantity,
    serialNumbers,
    invoiceNumber:        fields.invoiceNumber,
    suppliedBy:           fields.suppliedBy,
    installedBy:          fields.installedBy,
    warrantyFrom,
    warrantyTo,
    salesPerson:          fields.salesPerson,
    installationCopyUrl,
    invoiceCopyUrl,
    installationPhotosUrls,
    remarks:              fields.remarks,
    userId,
    status:               "pending",
  });

  return {
    id:            product._id.toString(),
    productName:   product.productName,
    productModel:  product.productModel,
    serialNumbers: product.serialNumbers,
    warrantyFrom:  product.warrantyFrom,
    warrantyTo:    product.warrantyTo,
    status:        product.status,
    createdAt:     product.createdAt,
  };
}

// ─── Get My Products ──────────────────────────────────────────────────────────
export async function getMyProducts(userId) {
  await connectDB();
  return Product.find({ userId }).sort({ createdAt: -1 }).lean();
}

// ─── Admin: Get All Products ──────────────────────────────────────────────────
export async function getAllProducts() {
  await connectDB();
  return Product.find({}).populate("userId", "name phone").sort({ createdAt: -1 }).lean();
}

// ─── Admin: Update Product Status ────────────────────────────────────────────
export async function updateProductStatus(id, status) {
  if (!["pending", "approved", "rejected"].includes(status)) {
    const err = new Error("Invalid status value."); err.status = 400; throw err;
  }

  await connectDB();
  const updated = await Product.findByIdAndUpdate(id, { status }, { new: true });
  if (!updated) {
    const err = new Error("Product not found."); err.status = 404; throw err;
  }

  // Fetch again with populated userId
  const product = await Product.findById(id).populate("userId");
  return { updated, product };
}
