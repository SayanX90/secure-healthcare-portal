import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  // If we already have a connection, verify it's still alive
  if (cached.conn) {
    const readyState = mongoose.connection.readyState;
    // 0 = disconnected, 3 = disconnecting — need to reconnect
    if (readyState === 0 || readyState === 3) {
      cached.conn = null;
      cached.promise = null;
    } else {
      return cached.conn;
    }
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxIdleTimeMS: 30000,
      })
      .then((mongoose) => {
        // Clear cache on unexpected disconnects so next request reconnects
        mongoose.connection.on("disconnected", () => {
          cached.conn = null;
          cached.promise = null;
        });
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.conn = null;
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
