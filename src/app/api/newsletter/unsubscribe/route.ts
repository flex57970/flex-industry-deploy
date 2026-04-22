import { NextRequest } from 'next/server';
import { unsubscribe } from '@/lib/agents/newsletter-agent';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return new Response('Token manquant', { status: 400 });

  const success = await unsubscribe(token);
  if (!success) return new Response('Lien invalide ou expiré', { status: 404 });

  const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" /><title>Désabonné</title><style>body{font-family:-apple-system,sans-serif;background:#fafaf9;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;}.card{background:#fff;padding:48px;border-radius:16px;max-width:420px;text-align:center;}h1{margin:0 0 12px;font-size:22px;}p{color:#6b7280;line-height:1.6;}a{color:#c9a870;text-decoration:none;}</style></head>
<body><div class="card"><h1>Désabonnement confirmé ✓</h1><p>Vous ne recevrez plus nos emails. Merci d'avoir suivi Flex.industry.</p><p><a href="https://flex-industry.fr">Retour au site</a></p></div></body></html>`;

  return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
