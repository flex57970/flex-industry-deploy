import type { Metadata } from 'next';
import connectDB from '@/lib/db';
import PortfolioCategory from '@/lib/models/PortfolioCategory';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    await connectDB();
    const cat = await PortfolioCategory.findOne({ slug, isActive: true }).lean<{
      name: string;
      description: string;
      coverUrl: string;
    } | null>();

    if (!cat) {
      return {
        title: 'Portfolio introuvable',
        description: 'Cette catégorie de portfolio n\'existe pas.',
      };
    }

    const title = `${cat.name} — Portfolio`;
    const description = cat.description || `Découvrez nos réalisations ${cat.name} chez Flex.industry — production visuelle premium.`;

    return {
      title,
      description,
      alternates: { canonical: `/portfolio/${slug}` },
      openGraph: {
        title: `${cat.name} — Flex.industry`,
        description,
        url: `/portfolio/${slug}`,
        type: 'website',
        images: cat.coverUrl ? [{ url: cat.coverUrl, alt: cat.name }] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${cat.name} — Flex.industry`,
        description,
        images: cat.coverUrl ? [cat.coverUrl] : undefined,
      },
    };
  } catch {
    return {
      title: 'Portfolio',
      description: 'Découvrez nos réalisations.',
    };
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
