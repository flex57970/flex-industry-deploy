import { NextRequest } from 'next/server';
import Automation from '@/lib/models/Automation';
import { requireAdmin } from '@/lib/auth-utils';

// Seed default automations on first request
const DEFAULT_AUTOMATIONS = [
  { key: 'daily_backup', name: 'Sauvegarde quotidienne', description: 'Dump MongoDB envoyé par email à 03h00 UTC chaque jour.', enabled: true },
  { key: 'weekly_report', name: 'Rapport hebdomadaire', description: 'Synthèse des leads, abonnés, médias et alertes envoyée chaque lundi matin.', enabled: true },
  { key: 'lead_followup', name: 'Relance leads J+3 / J+7', description: 'Email automatique de relance aux prospects sans réponse après 3 et 7 jours.', enabled: true },
  { key: 'check_failed_logins', name: 'Surveillance connexions', description: 'Vérifie les tentatives de connexion échouées et alerte si suspect.', enabled: true },
  { key: 'newsletter_broadcast', name: 'Broadcast nouveaux projets', description: 'Email automatique aux abonnés à chaque nouvelle catégorie portfolio publiée.', enabled: true },
  { key: 'ai_seo_descriptions', name: 'IA — Descriptions SEO auto', description: 'Génère automatiquement les méta-descriptions SEO pour les nouvelles catégories.', enabled: true },
  { key: 'ai_weekly_suggestions', name: 'IA — Suggestions hebdo', description: 'Analyse le site et propose 3-5 améliorations SEO chaque lundi.', enabled: true },
  { key: 'notion_sync', name: 'Synchronisation Notion', description: 'Chaque nouveau lead crée une fiche dans votre base Notion.', enabled: true },
];

async function seedAutomations() {
  for (const def of DEFAULT_AUTOMATIONS) {
    await Automation.updateOne(
      { key: def.key },
      { $setOnInsert: def },
      { upsert: true }
    );
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    await seedAutomations();
    const automations = await Automation.find().sort({ createdAt: 1 });
    return Response.json(automations);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;
  try {
    const { key, enabled } = await req.json();
    if (!key || typeof enabled !== 'boolean') {
      return Response.json({ message: 'Paramètres invalides' }, { status: 400 });
    }
    const auto = await Automation.findOneAndUpdate({ key }, { enabled }, { new: true });
    if (!auto) return Response.json({ message: 'Automation introuvable' }, { status: 404 });
    return Response.json(auto);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
