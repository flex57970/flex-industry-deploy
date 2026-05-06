import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import PageText from '@/lib/models/PageText';
import { PAGE_TEXT_DEFAULTS } from '@/lib/page-text-defaults';
import { requireAdmin, getAuthUser } from '@/lib/auth-utils';

async function seedPage(page: string): Promise<void> {
  const defaults = PAGE_TEXT_DEFAULTS.filter((d) => d.page === page);
  if (defaults.length === 0) return;
  for (const def of defaults) {
    await PageText.updateOne(
      { page: def.page, key: def.key },
      { $setOnInsert: { ...def } },
      { upsert: true }
    );
  }
}

// PUBLIC GET — used by public pages to render content
export async function GET(req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  try {
    const { page } = await params;
    if (!page || page.length > 100 || !/^[a-z0-9-]+$/.test(page)) {
      return Response.json({ message: 'Page invalide' }, { status: 400 });
    }

    await connectDB();
    await seedPage(page);

    const texts = await PageText.find({ page }).sort({ group: 1, order: 1 }).lean<{
      _id: unknown;
      page: string;
      key: string;
      label: string;
      value: string;
      type: string;
      group: string;
      order: number;
    }[]>();

    return Response.json(texts);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// ADMIN PUT — bulk update of texts on a page
export async function PUT(req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const auth = await getAuthUser(req);
  if (!auth || auth.role !== 'admin') {
    return Response.json({ message: 'Non autorisé' }, { status: 401 });
  }

  try {
    const { page } = await params;
    const { texts } = await req.json();

    if (!Array.isArray(texts) || texts.length > 200) {
      return Response.json({ message: 'Données invalides' }, { status: 400 });
    }

    await connectDB();
    await seedPage(page);

    const updated = [];
    for (const t of texts) {
      if (!t.key || typeof t.value !== 'string' || t.value.length > 20000) continue;
      const result = await PageText.findOneAndUpdate(
        { page, key: t.key },
        { value: t.value, updatedBy: auth._id },
        { new: true }
      );
      if (result) updated.push(result);
    }

    return Response.json({ updated: updated.length });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// Allow ADMIN POST to reset a page to defaults
export async function POST(req: NextRequest, { params }: { params: Promise<{ page: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    const { page } = await params;
    await connectDB();

    // Delete and recreate from defaults
    await PageText.deleteMany({ page });
    await seedPage(page);

    return Response.json({ message: 'Page réinitialisée aux valeurs par défaut' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
