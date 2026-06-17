import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "User",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"],
    },
    countryCode: {
      type: String,
      default: "+91",
      trim: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // ─── Personal Information (added for profile system) ────────────────────────
    personalEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    designation: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    // ─── Organization Information (added for profile system) ────────────────────
    organizationName: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    organizationEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    organizationPhone: {
      type: String,
      trim: true,
    },
    organizationAddress: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    profileCompleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true, // Auto-approve
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

// ─── Auto-cleanup stale indexes from old schema ──────────────────────────────
// The old schema had `email: { unique: true }` and `username: { unique: true }`.
// After migrating to phone+OTP, MongoDB still keeps those indexes, causing
// E11000 duplicate key errors when new users are created without those fields
// (all get null → unique conflict). This drops them automatically on first load.
const STALE_INDEXES = ["email_1", "username_1"];

(async () => {
  try {
    const collection = User.collection;
    const indexes = await collection.indexes();
    for (const name of STALE_INDEXES) {
      if (indexes.some((idx) => idx.name === name)) {
        await collection.dropIndex(name);
        console.log(`[User] Dropped stale index: ${name}`);
      }
    }
  } catch (_) {
    // Indexes don't exist or connection not ready yet — safe to ignore.
    // The migration script (scripts/dropStaleIndexes.js) can be run manually.
  }
})();

export default User;
