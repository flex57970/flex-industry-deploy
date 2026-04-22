/**
 * Notion agent — syncs leads to a Notion database.
 * Requires NOTION_API_KEY and NOTION_LEADS_DATABASE_ID.
 *
 * Expected Notion DB schema (columns):
 *  - Nom (title)
 *  - Email (email)
 *  - Téléphone (phone_number)
 *  - Entreprise (rich_text)
 *  - Service (select: Immobilier / Automobile / Parfumerie / Autre)
 *  - Message (rich_text)
 *  - Statut (select: Nouveau / Contacté / Devis / Gagné / Perdu)
 *  - Date (date)
 */

import type { ILead } from '@/lib/models/Lead';

const NOTION_API_URL = 'https://api.notion.com/v1/pages';
const NOTION_VERSION = '2022-06-28';

function richText(content: string): { text: { content: string } }[] {
  return [{ text: { content: content.slice(0, 2000) } }];
}

function mapStatusToNotion(status: string): string {
  const map: Record<string, string> = {
    nouveau: 'Nouveau',
    contacte: 'Contacté',
    devis: 'Devis',
    gagne: 'Gagné',
    perdu: 'Perdu',
  };
  return map[status] || 'Nouveau';
}

export async function syncLeadToNotion(lead: ILead): Promise<{ success: boolean; pageId?: string; error?: string }> {
  const apiKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_LEADS_DATABASE_ID;

  if (!apiKey || !dbId) {
    return { success: false, error: 'Notion non configuré (NOTION_API_KEY ou NOTION_LEADS_DATABASE_ID manquant)' };
  }

  try {
    const body = {
      parent: { database_id: dbId },
      properties: {
        Nom: { title: richText(lead.name) },
        Email: { email: lead.email },
        ...(lead.phone ? { Téléphone: { phone_number: lead.phone } } : {}),
        ...(lead.company ? { Entreprise: { rich_text: richText(lead.company) } } : {}),
        Service: { select: { name: lead.service } },
        Message: { rich_text: richText(lead.message) },
        Statut: { select: { name: mapStatusToNotion(lead.status) } },
        Date: { date: { start: lead.createdAt.toISOString() } },
      },
    };

    const res = await fetch(NOTION_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': NOTION_VERSION,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return { success: false, error: `Notion API ${res.status}: ${errorText.slice(0, 200)}` };
    }

    const data = (await res.json()) as { id: string };

    // Save Notion page ID back to lead for future updates
    if (data.id) {
      lead.notionPageId = data.id;
      await lead.save();
    }

    return { success: true, pageId: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
