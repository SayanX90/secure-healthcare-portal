/**
 * One-time migration script to drop stale `email_1` and `username_1`
 * unique indexes from the `users` collection.
 *
 * Run once:  node backend/scripts/dropStaleIndexes.js
 *
 * This is needed because the old User schema had unique constraints on
 * `email` and `username`. After switching to phone+OTP auth, those fields
 * were removed from the Mongoose schema, but MongoDB keeps the indexes.
 * Any new user created without those fields gets `null`, and the unique
 * indexes reject duplicates on `null`, causing E11000.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (adjust path if your .env lives elsewhere)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in environment variables.");
  process.exit(1);
}

async function run() {
  try {
    await mongoose.connect(MONGODB_URI, { bufferCommands: false });
    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collection = db.collection("users");

    // List current indexes
    const indexes = await collection.indexes();
    console.log("\nCurrent indexes on 'users' collection:");
    indexes.forEach((idx) => console.log(`  - ${idx.name}:`, JSON.stringify(idx.key)));

    // Drop stale indexes from old email/password auth schema
    const STALE_INDEXES = ["email_1", "username_1"];

    for (const name of STALE_INDEXES) {
      if (indexes.find((idx) => idx.name === name)) {
        await collection.dropIndex(name);
        console.log(`\n✅ Dropped stale index: ${name}`);
      } else {
        console.log(`\nℹ️  No '${name}' index found — nothing to drop.`);
      }
    }

    // Verify final state
    const remaining = await collection.indexes();
    console.log("\nFinal indexes on 'users' collection:");
    remaining.forEach((idx) => console.log(`  - ${idx.name}:`, JSON.stringify(idx.key)));

    console.log("\n✅ Migration complete.");
  } catch (err) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
