import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Visit from '@/lib/models/Visit';
import { hashVisitor, detectDevice, isBot } from '@/lib/visit-utils';
import { getClientIp, getUserAgent } from '@/lib/request-utils';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const userAgent = getUserAgent(req);

    // Skip bots silently
    if (isBot(userAgent)) {
      return Response.json({ tracked: false, reason: 'bot' });
    }

    const body = await req.json().catch(() => ({}));
    const path = (body.path as string) || '/';
    const referrer = (body.referrer as string) || '';
    const sessionId = (body.sessionId as string) || '';

    // Skip /admin pages from analytics
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return Response.json({ tracked: false, reason: 'admin' });
    }

    if (path.length > 500) {
      return Response.json({ tracked: false, reason: 'path_too_long' }, { status: 400 });
    }

    await connectDB();

    const visitorHash = hashVisitor(ip, userAgent);
    const device = detectDevice(userAgent);

    // Anti-spam: 1 visite par (visitor + path) toutes les 30 secondes
    const thirtySecondsAgo = new Date(Date.now() - 30 * 1000);
    const existing = await Visit.findOne({
      visitorHash,
      path,
      createdAt: { $gte: thirtySecondsAgo },
    });
    if (existing) {
      return Response.json({ tracked: false, reason: 'duplicate' });
    }

    await Visit.create({
      path,
      visitorHash,
      referrer: referrer.slice(0, 500),
      userAgent: userAgent.slice(0, 500),
      device,
      sessionId: sessionId.slice(0, 64),
    });

    return Response.json({ tracked: true });
  } catch {
    // Silently fail - on ne doit jamais casser la page si le tracking plante
    return Response.json({ tracked: false, reason: 'error' });
  }
}
