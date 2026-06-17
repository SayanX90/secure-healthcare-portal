import mongoose from "mongoose";

const bookServiceSchema = new mongoose.Schema(
  {
    // ── Owner ─────────────────────────────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    // ── Product ───────────────────────────────────────────────
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product reference is required"],
    },

    // ── Customer (auto-populated from session) ────────────────
    customerName: {
      type: String,
      trim: true,
      default: "",
    },
    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    // ── Contact Details ───────────────────────────────────────
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^\d{10}$/, "Contact number must be exactly 10 digits."],
      trim: true,
    },
    contactPersonNumber: {
      type: String,
      required: [true, "Contact person number is required"],
      match: [/^\d{10}$/, "Contact person number must be exactly 10 digits."],
      trim: true,
    },
    alternativeNumber: {
      type: String,
      trim: true,
      default: "",
      validate: {
        validator: function (v) {
          return !v || /^\d{10}$/.test(v);
        },
        message: "Alternative number must be exactly 10 digits.",
      },
    },

    // ── Problem Details ───────────────────────────────────────
    problemImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: "Please upload at least one problem image.",
      },
    },
    problemDescription: {
      type: String,
      required: [true, "Problem description is required"],
      minlength: [10, "Please provide a detailed problem description."],
      trim: true,
    },

    // ── Status ────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["Pending", "Assigned", "InProgress", "Resolved", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const BookService =
  mongoose.models.BookService || mongoose.model("BookService", bookServiceSchema);

export default BookService;
