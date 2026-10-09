const Template = require('./models/Template');

const templates = [
  { name: 'SaaS Landing Page', description: 'A clean, conversion-focused landing page for software products.', category: 'Landing Page', thumbnail_url: 'https://picsum.photos/seed/saas/600/400' },
  { name: 'Admin Dashboard', description: 'Responsive dashboard with charts, tables and sidebar navigation.', category: 'Dashboard', thumbnail_url: 'https://picsum.photos/seed/admin/600/400' },
  { name: 'Portfolio Starter', description: 'Minimal portfolio to showcase your projects and skills.', category: 'Portfolio', thumbnail_url: 'https://picsum.photos/seed/portfolio/600/400' },
  { name: 'E-commerce Storefront', description: 'Product grid, cart and checkout layout for online shops.', category: 'E-commerce', thumbnail_url: 'https://picsum.photos/seed/shop/600/400' },
  { name: 'Blog Magazine', description: 'Content-first blog layout with featured posts and categories.', category: 'Blog', thumbnail_url: 'https://picsum.photos/seed/blog/600/400' },
  { name: 'Startup Pitch Page', description: 'One-page pitch with team, roadmap and investor contact form.', category: 'Landing Page', thumbnail_url: 'https://picsum.photos/seed/pitch/600/400' },
  { name: 'Analytics Report', description: 'Data-heavy report template with KPI cards and graphs.', category: 'Dashboard', thumbnail_url: 'https://picsum.photos/seed/analytics/600/400' },
];

async function seed() {
  const count = await Template.countDocuments();
  if (count > 0) return console.log('Templates already seeded.');
  await Template.insertMany(templates);
  console.log(`Seeded ${templates.length} templates.`);
}

if (require.main === module) {
  const { connectDB } = require('./db');
  require('dotenv').config();
  connectDB()
    .then(seed)
    .then(() => process.exit(0))
    .catch((e) => { console.error(e); process.exit(1); });
}

module.exports = seed;
