/**
 * AI Agent — uses Anthropic Claude via the Messages API.
 * Requires ANTHROPIC_API_KEY env var. Degrades gracefully if not configured.
 */

const MODEL = 'claude-haiku-4-5';
const API_URL = 'https://api.anthropic.com/v1/messages';

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function callClaude(systemPrompt: string, messages: ClaudeMessage[], maxTokens = 1024): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      console.error('[ai-agent] Claude API error:', res.status, await res.text());
      return null;
    }

    const data = (await res.json()) as { content?: { type: string; text: string }[] };
    const textBlock = data.content?.find((c) => c.type === 'text');
    return textBlock?.text || null;
  } catch (err) {
    console.error('[ai-agent] callClaude failed:', err);
    return null;
  }
}

/**
 * Generate a SEO-optimized description for a new portfolio category.
 */
export async function generateSeoDescription(categoryName: string, existingContext?: string): Promise<string | null> {
  const system = `Tu es un rédacteur SEO spécialisé en agences de communication visuelle premium.
Ton ton est sobre, haut de gamme, cinématographique — jamais putaclic.
Tu écris en français, au "nous". Tu parles pour Flex.industry, une agence premium spécialisée Immobilier, Automobile, Parfumerie.
Réponds avec une description de 2 phrases maximum (150-200 caractères idéal pour SEO), adaptée à une méta-description.
Pas de guillemets, pas de préambule, juste la description.`;

  const prompt = `Catégorie : "${categoryName}"${existingContext ? `\nContexte : ${existingContext}` : ''}`;

  return callClaude(system, [{ role: 'user', content: prompt }], 300);
}

/**
 * Analyze the site state and suggest SEO improvements.
 * Returns a list of actionable bullet points.
 */
export async function generateSeoSuggestions(): Promise<string[]> {
  // Gather context from DB to feed the AI
  const connectDB = (await import('@/lib/db')).default;
  const PortfolioCategory = (await import('@/lib/models/PortfolioCategory')).default;
  await connectDB();

  const categories = await PortfolioCategory.find({ isActive: true }).select('name description').lean<{ name: string; description: string }[]>();

  const context = categories.length > 0
    ? categories.map((c) => `- ${c.name}: ${c.description || '(pas de description)'}`).join('\n')
    : '(Aucune catégorie portfolio actuellement)';

  const system = `Tu es un expert SEO pour une agence de communication visuelle premium (Flex.industry, France, secteurs Immobilier/Automobile/Parfumerie).
Tu analyses le site et suggères 3 à 5 actions concrètes de SEO à faire cette semaine.
Chaque suggestion doit être spécifique, actionnable, et en une ligne (max 120 caractères).
Format: retourne une liste JSON de strings, exactement: ["suggestion 1", "suggestion 2", ...]
Aucun préambule, aucune explication, juste le JSON.`;

  const prompt = `Voici l'état des catégories portfolio :\n${context}\n\nDonne 3-5 suggestions SEO concrètes pour cette semaine.`;

  const response = await callClaude(system, [{ role: 'user', content: prompt }], 600);
  if (!response) return [];

  try {
    // Try to extract JSON array from response
    const match = response.match(/\[[\s\S]*\]/);
    if (!match) return [];
    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((s): s is string => typeof s === 'string').slice(0, 5);
  } catch {
    return [];
  }
}

/**
 * Draft a personalized reply to a lead (admin reviews before sending).
 */
export async function draftLeadReply(lead: {
  name: string;
  email: string;
  service: string;
  message: string;
}): Promise<string | null> {
  const system = `Tu rédiges des réponses d'email en français pour Flex.industry, une agence premium de communication visuelle.
Ton ton est professionnel, chaleureux, jamais servile. Tu parles au "nous".
Tu réponds au prospect en :
1. Le remerciant pour sa demande (concret, pas générique)
2. Montrant que tu as lu son message (cite un élément précis)
3. Proposant un échange téléphonique ou visio dans les 48h avec 2-3 créneaux
4. Signature : L'équipe Flex.industry

Format : juste le corps de l'email, pas de sujet ni de "Bonjour X" (ajouté automatiquement).
Maximum 150 mots.`;

  const prompt = `Prospect : ${lead.name} (${lead.email})
Service demandé : ${lead.service}
Son message : "${lead.message}"

Rédige la réponse.`;

  return callClaude(system, [{ role: 'user', content: prompt }], 500);
}
