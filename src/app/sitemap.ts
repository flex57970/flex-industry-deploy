import type { MetadataRoute } from 'next';
import connectDB from '@/lib/db';
import PortfolioCategory from '@/lib/models/PortfolioCategory';

const SITE_URL = 'https://flex-industry.fr';

export const revalidate = 3600; // Regenerate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/immobilier`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/automobile`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/parfumerie`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/portfolio`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${SITE_URL}/mentions-legales`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/confidentialite`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Dynamic portfolio category pages
  try {
    await connectDB();
    const categories = await PortfolioCategory.find({ isActive: true }).select('slug updatedAt').lean<{ slug: string; updatedAt: Date }[]>();
    const portfolioPages: MetadataRoute.Sitemap = categories.map((cat) => ({
      url: `${SITE_URL}/portfolio/${cat.slug}`,
      lastModified: cat.updatedAt || now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    return [...staticPages, ...portfolioPages];
  } catch {
    return staticPages;
  }
}
