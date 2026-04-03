import connectDB from '@/lib/db';
import { autoSeed } from '@/lib/seed';

export async function GET() {
  try {
    await connectDB();
    await autoSeed();
    return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch {
    return Response.json({ status: 'error', timestamp: new Date().toISOString() }, { status: 500 });
  }
}
