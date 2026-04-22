import { NextRequest } from 'next/server';
import mongoose from 'mongoose';
import Lead from '@/lib/models/Lead';
import { requireAdmin } from '@/lib/auth-utils';
import { draftLeadReply } from '@/lib/agents/ai-agent';

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { leadId } = await req.json();
    if (!leadId || !mongoose.Types.ObjectId.isValid(leadId)) {
      return Response.json({ message: 'leadId invalide' }, { status: 400 });
    }
    const lead = await Lead.findById(leadId);
    if (!lead) return Response.json({ message: 'Lead introuvable' }, { status: 404 });

    const reply = await draftLeadReply({
      name: lead.name,
      email: lead.email,
      service: lead.service,
      message: lead.message,
    });
    if (!reply) {
      return Response.json({ message: 'IA non configurée (ANTHROPIC_API_KEY manquant)' }, { status: 503 });
    }
    return Response.json({ reply });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
