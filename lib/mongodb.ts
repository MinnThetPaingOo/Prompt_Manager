import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const mongodbUri: string = MONGODB_URI;
const cached =
  global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  cached.promise ??= mongoose.connect(mongodbUri);
  cached.conn = await cached.promise;

  return cached.conn;
}
