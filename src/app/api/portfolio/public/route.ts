import connectDB from '@/lib/db';
import PortfolioCategory from '@/lib/models/PortfolioCategory';
import PortfolioGrid from '@/lib/models/PortfolioGrid';

export async function GET() {
  try {
    await connectDB();
    const categories = await PortfolioCategory.find({ isActive: true }).sort({ order: 1 });

    const result = await Promise.all(
      categories.map(async (cat) => {
        const grids = await PortfolioGrid.find({ categoryId: cat._id, isActive: true }).sort({ order: 1 });
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          coverUrl: cat.coverUrl,
          grids: grids.map((g) => ({
            _id: g._id,
            name: g.name,
            slug: g.slug,
            items: [...g.items].sort((a: { order: number }, b: { order: number }) => a.order - b.order),
          })),
        };
      })
    );

    return Response.json(result);
  } catch {
    return Response.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}
