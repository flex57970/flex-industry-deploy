import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import PageText from '@/lib/models/PageText';
import { PAGE_TEXT_DEFAULTS, PAGE_LABELS } from '@/lib/page-text-defaults';
import { requireAdmin } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    await connectDB();

    // Seed all default pages on first request
    for (const def of PAGE_TEXT_DEFAULTS) {
      await PageText.updateOne(
        { page: def.page, key: def.key },
        { $setOnInsert: { ...def } },
        { upsert: true }
      );
    }

    // Build index of pages with counts
    const aggregate = await PageText.aggregate([
      { $group: { _id: '$page', count: { $sum: 1 }, lastUpdated: { $max: '$updatedAt' } } },
    ]);

    const pages = aggregate.map((row: { _id: string; count: number; lastUpdated: Date }) => ({
      page: row._id,
      label: PAGE_LABELS[row._id] || row._id,
      count: row.count,
      lastUpdated: row.lastUpdated,
    }));

    return Response.json(pages);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
