import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // ── Customer ──────────────────────────────────────────────
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      maxlength: 120,
    },
    customerAddress: {
      type: String,
      required: [true, "Customer address is required"],
      trim: true,
    },

    // ── Product ───────────────────────────────────────────────
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    productModel: {
      type: String,
      required: [true, "Product model is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    serialNumbers: {
      type: [String],
      required: [true, "Serial numbers are required"],
      validate: {
        validator: function (arr) { return Array.isArray(arr) && arr.length > 0 && arr.every((s) => s.trim() !== ""); },
        message: "All serial number fields must be filled in.",
      },
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      trim: true,
    },

    // ── Supply & Installation ─────────────────────────────────
    suppliedBy: { type: String, trim: true, default: "" },
    installedBy: { type: String, trim: true, default: "" },

    // ── Warranty ──────────────────────────────────────────────
    warrantyFrom: {
      type: Date,
      required: [true, "Warranty start date is required"],
    },
    warrantyTo: {
      type: Date,
      required: [true, "Warranty end date is required"],
    },

    // ── People ────────────────────────────────────────────────
    salesPerson: { type: String, trim: true, default: "" },

    // ── File URLs (stored as strings after upload) ────────────
    installationCopyUrl: { type: String, default: "" },   // URL
    invoiceCopyUrl:      { type: String, default: "" },   // URL
    installationPhotosUrls: { type: [String], default: [] }, // Array of URLs

    // ── Misc ──────────────────────────────────────────────────
    remarks: { type: String, trim: true, default: "" },

    // ── Status ────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    // ── Owner ─────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
