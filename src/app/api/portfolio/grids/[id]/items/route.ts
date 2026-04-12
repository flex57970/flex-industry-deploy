import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import PortfolioGrid from '@/lib/models/PortfolioGrid';
import { requireAdmin } from '@/lib/auth-utils';

// Add item to grid
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const { mediaUrl, mediaType, caption } = await req.json();
    if (!mediaUrl) return Response.json({ message: 'mediaUrl requis' }, { status: 400 });

    const grid = await PortfolioGrid.findById(id);
    if (!grid) return Response.json({ message: 'Grille introuvable' }, { status: 404 });

    const order = grid.items.length;
    grid.items.push({ mediaUrl, mediaType: mediaType || 'image', caption: caption || '', order });
    await grid.save();

    return Response.json(grid, { status: 201 });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// Update all items (reorder / bulk update)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const { items } = await req.json();

    const grid = await PortfolioGrid.findByIdAndUpdate(
      id,
      { items },
      { new: true }
    );
    if (!grid) return Response.json({ message: 'Grille introuvable' }, { status: 404 });

    return Response.json(grid);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// Delete an item from grid
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const { itemId } = await req.json();
    if (!itemId) return Response.json({ message: 'itemId requis' }, { status: 400 });

    const grid = await PortfolioGrid.findById(id);
    if (!grid) return Response.json({ message: 'Grille introuvable' }, { status: 404 });

    grid.items = grid.items.filter((item: { _id?: mongoose.Types.ObjectId }) => item._id?.toString() !== itemId);
    await grid.save();

    return Response.json(grid);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
