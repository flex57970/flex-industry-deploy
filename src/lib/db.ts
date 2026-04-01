import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const cached = (global as Record<string, unknown>).mongoose as { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } || { conn: null, promise: null };
(global as Record<string, unknown>).mongoose = cached;

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
