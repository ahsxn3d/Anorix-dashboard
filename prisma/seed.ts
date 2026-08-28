import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const AUTHORIZED_EMAIL = 'muhammadahsanjaved09@gmail.com';

async function main() {
  console.log('🌱 Starting foundational database seeding (zero mock data)...');

  // 1. Verified Admin User (SUPERADMIN)
  const adminUser = await prisma.user.upsert({
    where: { email: AUTHORIZED_EMAIL },
    update: {
      role: 'SUPERADMIN',
    },
    create: {
      email: AUTHORIZED_EMAIL,
      name: 'Ahsan',
      role: 'SUPERADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });
  console.log(`✅ Admin User verified: ${adminUser.email} [${adminUser.role}]`);

  // 2. Singleton SiteConfig
  const siteConfig = await prisma.siteConfig.upsert({
    where: { id: 'site-config' },
    update: {
      brandName: 'ANORIX',
      brandLogoText: 'ANORIX',
    },
    create: {
      id: 'site-config',
      brandName: 'ANORIX',
      brandLogoText: 'ANORIX',
      brandTagline: 'CYBERNETIC CRAFT & DIGITAL REALMS',
      liveBadgeStatus: 'ONLINE // 60FPS',
      contactEmail: AUTHORIZED_EMAIL,
    },
  });
  console.log(`✅ SiteConfig initialized: ${siteConfig.brandName}`);

  // 3. Singleton HeroContent
  const heroContent = await prisma.heroContent.upsert({
    where: { id: 'hero-content' },
    update: {},
    create: {
      id: 'hero-content',
      badgeText: '[ SOLO CREATIVE DEVELOPER & 3D ARTIST ]',
      headlineLine1: 'CYBERNETiC CRAFT',
      headlineLine2: 'DiGiTAL REALMS',
      headlineLine3: 'ENGiNEERED.',
      highlightedWord: 'CRAFT',
      bioSubtext: 'Bespoke web architectures, interactive WebGL experiences, and high-performance SaaS dashboards engineered for modern digital brands.',
      primaryCtaLabel: 'START A PROJECT ↗',
      primaryCtaRoute: 'contact',
      secondaryCtaLabel: 'BROWSE DEPLOYMENTS',
      secondaryCtaRoute: 'deployments',
      telemetryStatus: 'ONLINE',
      telemetryLatency: '4ms',
      telemetryUptime: '99.98%',
      pricingNoticeText: 'Custom builds starting at $1,000 // Fast turnaround',
    },
  });
  console.log(`✅ HeroContent initialized: ${heroContent.id}`);

  // 4. Singleton AboutContent
  const aboutContent = await prisma.aboutContent.upsert({
    where: { id: 'about-content' },
    update: {},
    create: {
      id: 'about-content',
      name: 'ANORENT',
      artistName: 'Ahsan',
      role: 'Lead Creative Technologist & Full-Stack Architect',
      tagline: 'Crafting high-performance web architectures, scalable SaaS dashboards, and immersive 3D interfaces.',
      handle: 'ahsxn.3d',
      executiveBio: 'ANORENT is a boutique digital engineering studio dedicated to craftsmanship and architectural clarity.',
      location: 'Global Remote // Earth Grid',
      locationTimezone: 'UTC / EST Active',
      availabilityStatus: 'LIMITED SLOTS AVAILABLE',
      yearsActive: '7+ Years',
      deploymentsDelivered: '0',
      clientSatisfaction: '100%',
      techSkills: [
        'React 19',
        'Next.js 15',
        'TypeScript',
        'Tailwind CSS',
        'PostgreSQL',
        'Prisma ORM',
        'Three.js / WebGL',
      ],
      contactEmail: AUTHORIZED_EMAIL,
    },
  });
  console.log(`✅ AboutContent initialized: ${aboutContent.artistName}`);

  // 5. Singleton FAQ Header Config
  const faqHeader = await prisma.faqHeaderConfig.upsert({
    where: { id: 'faq-header-config' },
    update: {},
    create: {
      id: 'faq-header-config',
      badgeText: 'SECURITY & ESCROW PROTOCOL',
      pageTitle: 'Frequently Asked Questions',
      pageSubtitle: 'Transparent technical answers regarding our architecture, sprint deliverables, and code ownership.',
      searchPlaceholder: 'Search architecture FAQs...',
      supportEmail: AUTHORIZED_EMAIL,
    },
  });
  console.log(`✅ FAQ Header Config initialized: ${faqHeader.pageTitle}`);

  console.log('✨ Database seeding complete. Zero fake submissions or reviews present.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
