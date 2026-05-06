import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Visit from '@/lib/models/Visit';
import { requireAdmin } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (auth instanceof Response) return auth;

  try {
    await connectDB();

    const range = req.nextUrl.searchParams.get('range') || '30';
    const days = Math.min(parseInt(range, 10) || 30, 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalVisits,
      uniqueVisitors,
      visitsByDay,
      topPages,
      topReferrers,
      deviceBreakdown,
      todayVisits,
      yesterdayVisits,
    ] = await Promise.all([
      Visit.countDocuments({ createdAt: { $gte: since } }),
      Visit.distinct('visitorHash', { createdAt: { $gte: since } }).then((arr) => arr.length),

      // Daily visits + unique visitors per day
      Visit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Europe/Paris' } },
            visits: { $sum: 1 },
            uniqueVisitors: { $addToSet: '$visitorHash' },
          },
        },
        { $project: { date: '$_id', visits: 1, uniqueVisitors: { $size: '$uniqueVisitors' }, _id: 0 } },
        { $sort: { date: 1 } },
      ]),

      // Top 10 pages
      Visit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$path', visits: { $sum: 1 }, unique: { $addToSet: '$visitorHash' } } },
        { $project: { path: '$_id', visits: 1, unique: { $size: '$unique' }, _id: 0 } },
        { $sort: { visits: -1 } },
        { $limit: 10 },
      ]),

      // Top 8 referrers (sources de trafic)
      Visit.aggregate([
        { $match: { createdAt: { $gte: since }, referrer: { $ne: '' } } },
        {
          $project: {
            domain: {
              $let: {
                vars: { hostMatch: { $regexFind: { input: '$referrer', regex: /^https?:\/\/([^/]+)/ } } },
                in: { $ifNull: [{ $arrayElemAt: ['$$hostMatch.captures', 0] }, '$referrer'] },
              },
            },
            visitorHash: 1,
          },
        },
        { $group: { _id: '$domain', visits: { $sum: 1 }, unique: { $addToSet: '$visitorHash' } } },
        { $project: { domain: '$_id', visits: 1, unique: { $size: '$unique' }, _id: 0 } },
        { $sort: { visits: -1 } },
        { $limit: 8 },
      ]),

      // Device breakdown
      Visit.aggregate([
        { $match: { createdAt: { $gte: since } } },
        { $group: { _id: '$device', count: { $sum: 1 } } },
        { $project: { device: '$_id', count: 1, _id: 0 } },
      ]),

      Visit.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      }),

      Visit.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0) - 24 * 60 * 60 * 1000),
          $lt: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      }),
    ]);

    return Response.json({
      summary: {
        totalVisits,
        uniqueVisitors,
        todayVisits,
        yesterdayVisits,
        avgPerDay: Math.round(totalVisits / days),
      },
      visitsByDay,
      topPages,
      topReferrers,
      deviceBreakdown,
    });
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
