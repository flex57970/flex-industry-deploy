import connectDB from './db';
import User from './models/User';
import Content from './models/Content';

let seeded = false;

export async function autoSeed() {
  if (seeded) return;
  seeded = true;

  await connectDB();

  const adminEmail = process.env.ADMIN_SEED_EMAIL || 'admin@flex.industry';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'Admin2024!';
  const existing = await User.findOne({ email: adminEmail });
  if (!existing) {
    await User.create({ firstName: 'Admin', lastName: 'Flex', email: adminEmail, password: adminPassword, role: 'admin' });
    console.log('Auto-seed: admin created');
  }

  const count = await Content.countDocuments();
  if (count === 0) {
    await Content.insertMany([
      { section: 'hero', page: 'home', title: "Nous créons l'extraordinaire", subtitle: 'Agence de communication visuelle premium', description: "Contenu cinématographique haut de gamme pour les marques qui refusent l'ordinaire.", order: 0 },
      { section: 'about', page: 'home', title: 'Une vision cinématographique', description: 'Flex.industry est une agence de communication visuelle premium.', order: 1 },
      { section: 'hero', page: 'immobilier', title: 'Immobilier', subtitle: "Des productions visuelles qui subliment l'immobilier de prestige", order: 0 },
      { section: 'hero', page: 'automobile', title: 'Automobile', subtitle: "L'art de capturer la puissance et l'élégance automobile", order: 0 },
      { section: 'hero', page: 'parfumerie', title: 'Parfumerie', subtitle: 'Des créations visuelles qui éveillent les sens', order: 0 },
    ]);
    console.log('Auto-seed: default content created');
  }
}
