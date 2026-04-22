import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import Lead from '@/lib/models/Lead';
import { requireAdmin } from '@/lib/auth-utils';
import { logActivity } from '@/lib/agents/security-agent';

const ALLOWED_STATUSES = ['nouveau', 'contacte', 'devis', 'gagne', 'perdu'];

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const lead = await Lead.findById(id);
    if (!lead) return Response.json({ message: 'Lead introuvable' }, { status: 404 });
    return Response.json(lead);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const data = await req.json();

    const update: Record<string, unknown> = {};
    if (data.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(data.status)) {
        return Response.json({ message: 'Statut invalide' }, { status: 400 });
      }
      update.status = data.status;
      if (data.status === 'contacte') update.lastContactedAt = new Date();
    }
    if (data.notes !== undefined) {
      if (typeof data.notes !== 'string' || data.notes.length > 10000) {
        return Response.json({ message: 'Notes invalides' }, { status: 400 });
      }
      update.notes = data.notes;
    }

    const lead = await Lead.findByIdAndUpdate(id, update, { new: true });
    if (!lead) return Response.json({ message: 'Lead introuvable' }, { status: 404 });

    if (update.status) {
      logActivity({
        type: 'lead_status_changed',
        severity: 'info',
        description: `Lead ${lead.name} passé en "${update.status}"`,
        metadata: { leadId: id, newStatus: update.status },
      }).catch(() => {});
    }

    return Response.json(lead);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return Response.json({ message: 'ID invalide' }, { status: 400 });
    const deleted = await Lead.findByIdAndDelete(id);
    if (!deleted) return Response.json({ message: 'Lead introuvable' }, { status: 404 });
    return Response.json({ message: 'Lead supprimé' });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
