import mongoose from "mongoose";

const generatedOtpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    countryCode: {
      type: String,
      required: true,
      default: "+91",
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const GeneratedOtp =
  mongoose.models.GeneratedOtp || mongoose.model("GeneratedOtp", generatedOtpSchema);

// ─── Auto-cleanup: Remove any TTL indexes so OTP history is kept permanently ─
// A previous schema version may have set a TTL index on `expiresAt` or `createdAt`.
// MongoDB's TTL background thread silently deletes expired documents every 60s.
// Since generatedotps now acts as permanent OTP login history, we drop all TTL indexes.
(async () => {
  try {
    const collection = GeneratedOtp.collection;
    const indexes = await collection.indexes();
    for (const idx of indexes) {
      if (idx.expireAfterSeconds !== undefined && idx.name !== "_id_") {
        await collection.dropIndex(idx.name);
        console.log(`[GeneratedOtp] Dropped TTL index: ${idx.name}`);
      }
    }
  } catch (_) {
    // Connection not ready yet or indexes already clean — safe to ignore.
  }
})();

export default GeneratedOtp;

