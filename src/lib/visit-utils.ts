import crypto from 'crypto';

const SALT = process.env.VISIT_SALT || 'flex-industry-default-salt-2026';

/**
 * Hash de l'IP+UA, anonymisé (RGPD-friendly).
 * Le hash change chaque jour pour empêcher le tracking long terme.
 */
export function hashVisitor(ip: string, userAgent: string): string {
  const day = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return crypto
    .createHash('sha256')
    .update(`${ip}|${userAgent}|${day}|${SALT}`)
    .digest('hex')
    .slice(0, 32);
}

export function detectDevice(ua: string): 'mobile' | 'tablet' | 'desktop' | 'bot' {
  if (!ua) return 'desktop';
  const lower = ua.toLowerCase();
  if (/bot|crawler|spider|scraper|googlebot|bingbot/i.test(lower)) return 'bot';
  if (/tablet|ipad/i.test(lower)) return 'tablet';
  if (/mobile|android|iphone/i.test(lower)) return 'mobile';
  return 'desktop';
}

/**
 * Bloque les bots les plus communs (Google les indexe via une autre URL).
 */
export function isBot(ua: string): boolean {
  if (!ua) return false;
  return /bot|crawler|spider|scraper/i.test(ua);
}
