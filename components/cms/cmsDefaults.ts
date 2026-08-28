import {
  MasterWebsiteCustomizerData,
  DeploymentProduct,
  HeroSectionContent,
  EngineeringLabContent,
  MilestoneCard,
  StoryStageContent,
  AboutPageContent,
  ReviewItem,
  ContactPageContent,
  FooterContent,
  SiteHeaderConfig,
  FaqSectionContent,
  FaqItem,
} from '@/lib/types';

export const INITIAL_DEPLOYMENTS_CMS: DeploymentProduct[] = [];

export const INITIAL_HERO_CMS: HeroSectionContent = {
  id: 'hero-section-content',
  brandLogoText: 'ANORENT',
  topBadgeText: '[ SOLO CREATIVE DEVELOPER & 3D ARTIST ]',
  headlineLine1: 'CYBERNETiC CRAFT',
  headlineLine2: 'DiGiTAL REALMS',
  headlineLine3: 'ENGiNEERED.',
  bioSubtext: 'Bespoke web architectures, interactive WebGL experiences, and high-performance SaaS dashboards engineered for modern digital brands.',
  highlightWords: ['CRAFT', 'DiGiTAL', 'ENGiNEERED'],
  primaryCtaLabel: 'START A PROJECT ↗',
  primaryCtaRoute: '/inquiries',
  secondaryCtaLabel: 'BROWSE DEPLOYMENTS',
  secondaryCtaRoute: '/deployments',
  pricingNoticeText: 'Custom builds starting at $1,000 // Fast turnaround',
  fpsBadgeText: '60 FPS Locked',
  pingBadgeText: '4ms Edge Sync',
  livePercentBadgeText: '99.98% Availability',
  nodeCountText: 'Global Edge Grid',
  particleModes: ['Dark Prismatic', 'Cyber Grid', 'Constellation', 'Minimal Void'],
  defaultParticleMode: 'Dark Prismatic',
  baseNodeCount: 120,
  targetFps: 60,
};

export const INITIAL_ENGINEERING_LAB_CMS: EngineeringLabContent = {
  id: 'engineering-lab-content',
  badgeText: 'LABS PROTOCOL // 2026',
  sectionTitle: 'ENGINEERING & SHADER LAB',
  sectionSubtitle: 'Experimental canvas sandbox stress-testing raw GPU draw calls, zero-latency WebSockets, and spring kinetics.',
  systemStatus: 'ONLINE // 120HZ COMPATIBLE',
  targetFps: 120,
  memoryBudget: '< 45MB VRAM',
  shaderCompiles: '0 Jitter / Precompiled',
  activeShadersCount: 0,
  demoCards: [],
};

export const INITIAL_MILESTONES_CMS: MilestoneCard[] = [];

export const INITIAL_STAGES_CMS: StoryStageContent[] = [
  {
    id: 'stage-0',
    stageIndex: 0,
    stageBadge: '01 // ARCHITECTURAL MASTERY',
    headlineLine1: 'Systems',
    headlineLine2: 'Blueprinting',
    description: 'Technical discovery, architectural scoping, zero-latency state design, and interactive UX wireframes engineered for peak execution speed.',
    specTag1Title: 'Latency Target',
    specTag1Sub: '< 12ms Edge Sync',
    specTag2Title: 'Fidelity',
    specTag2Sub: '100% Vector Pixel Perfect',
    specTag3Title: 'Output',
    specTag3Sub: 'Production Tech Spec',
    bulletPoints: [
      'PostgreSQL Connection Pooling',
      'Edge Middleware Route Protection',
      'Atomic Type-Safe Server Actions',
    ],
    defaultTension: 320,
    defaultDamping: 24,
    primaryCtaLabel: 'Review Scope Blueprint',
    primaryCtaRoute: '/contact',
    secondaryCtaLabel: 'View Architecture',
    secondaryCtaRoute: '/deployments',
    architectureNodes: [],
    escrowPhases: [],
  },
];

export const INITIAL_ABOUT_CMS: AboutPageContent = {
  artistName: 'Ahsan',
  profileName: 'Ahsan',
  handle: 'ahsxn.3d',
  role: 'Lead Creative Technologist & Full-Stack Architect',
  title: 'Lead Creative Technologist & Full-Stack Architect',
  location: 'Global Remote // Earth Grid',
  locationTimezone: 'UTC / EST Active',
  executiveBio: 'ANORENT is a boutique digital engineering studio dedicated to craftsmanship and architectural clarity. Crafting high-performance web architectures, scalable SaaS dashboards, and immersive 3D interfaces.',
  techSkills: [
    'React 19',
    'Next.js 15',
    'TypeScript',
    'Tailwind CSS',
    'PostgreSQL',
    'Prisma ORM',
    'Three.js / WebGL',
    'GLSL Shaders',
    'Framer Motion',
  ],
  directEmail: 'muhammadahsanjaved09@gmail.com',
  contactEmail: 'muhammadahsanjaved09@gmail.com',
  timeZone: 'UTC / EST Active',
  availability: 'LIMITED SLOTS AVAILABLE',
  proofMetrics: [
    {
      id: 'metric-1',
      label: 'Deployments Delivered',
      value: '12+',
      subtext: 'Bespoke full-stack architectures shipped',
      icon: 'zap',
    },
    {
      id: 'metric-2',
      label: 'Client Satisfaction',
      value: '99.8%',
      subtext: 'Zero SLA compromises on project delivery',
      icon: 'shield',
    },
    {
      id: 'metric-3',
      label: 'Years Active in Industry',
      value: '5+ Years',
      subtext: 'Continuous high-scale engineering track record',
      icon: 'trending',
    },
    {
      id: 'metric-4',
      label: 'Hardware Motion Benchmark',
      value: '60 FPS / <30ms',
      subtext: 'Zero frame drops with WebGL GPU acceleration',
      icon: 'clock',
    },
  ],
};

export const INITIAL_REVIEWS_CMS: ReviewItem[] = [];

export const INITIAL_CONTACT_CMS: ContactPageContent = {
  headline: 'INITIATE BESPOKE DEPLOYMENT',
  subtitle: 'Direct founder engagement with milestone-protected escrow guarantees. Share your technical requirements below.',
  directEmail: 'muhammadahsanjaved09@gmail.com',
  budgetTierOptions: [
    '$1k - $3k (Micro Deployment)',
    '$3k - $7k (Full Web App)',
    '$7k - $15k (Enterprise Architecture)',
    '$15k+ (Bespoke Retainer / Studio Partner)',
  ],
  channels: [
    {
      id: 'chan-email',
      channelKey: 'email',
      label: 'Direct Founder Email',
      value: 'muhammadahsanjaved09@gmail.com',
      linkUrl: 'mailto:muhammadahsanjaved09@gmail.com',
      badge: '< 2h Response',
      isEnabled: true,
    },
  ],
};

export const INITIAL_FOOTER_CMS: FooterContent = {
  tagline: 'ARCHITECTING HIGH-VELOCITY DIGITAL SYSTEMS // BUILT WITH NEXT.JS 15 & HARDWARE SHADERS',
  copyrightText: '© 2026 ANORENT STUDIO. ALL RIGHTS RESERVED.',
  copyrightStatement: '© 2026 ANORENT STUDIO. ALL RIGHTS RESERVED. CRAFTED BY AHSAN JAVED.',
  bottomBadgeLeft: 'ARCHITECTURAL GRADE // LIGHTHOUSE 100',
  bottomBadgeRight: '100% IP TRANSFER ON DEPLOYMENT',
  disclaimerText: 'All client escrow deposits are locked in milestone smart accounts until production acceptance testing is certified.',
  socialLinks: {
    email: 'muhammadahsanjaved09@gmail.com',
    fiverr: 'https://fiverr.com',
    dribbble: 'https://dribbble.com',
    twitter: 'https://x.com',
    whatsapp: 'https://wa.me',
    github: 'https://github.com',
  },
};

export const INITIAL_HEADER_CMS: SiteHeaderConfig = {
  brandName: 'ANORENT',
  brandLogoText: 'ANORENT',
  brandTagline: 'CYBERNETIC CRAFT & DIGITAL REALMS',
  liveBadgeStatus: 'ONLINE // 60FPS',
  navLinks: [
    { id: 'nav-1', label: 'DEPLOYMENTS', route: '/deployments', isExternal: false, isPrimary: false },
    { id: 'nav-2', label: 'STUDIO', route: '/about', isExternal: false, isPrimary: false },
    { id: 'nav-3', label: 'INQUIRIES', route: '/inquiries', isExternal: false, isPrimary: true },
  ],
};

export const INITIAL_FAQS_CMS: FaqItem[] = [];

export const INITIAL_FAQ_HEADER_CMS = {
  badgeText: 'SECURITY & ESCROW PROTOCOL',
  pageTitle: 'Frequently Asked Questions',
  pageSubtitle: 'Transparent technical answers regarding our architecture, sprint deliverables, and code ownership.',
  searchPlaceholder: 'Search architecture FAQs...',
  supportEmail: 'muhammadahsanjaved09@gmail.com',
};

export const INITIAL_MASTER_CUSTOMIZER_DATA: MasterWebsiteCustomizerData = {
  deployments: INITIAL_DEPLOYMENTS_CMS,
  hero: INITIAL_HERO_CMS,
  engineeringLab: INITIAL_ENGINEERING_LAB_CMS,
  milestones: INITIAL_MILESTONES_CMS,
  stages: INITIAL_STAGES_CMS,
  about: INITIAL_ABOUT_CMS,
  reviews: INITIAL_REVIEWS_CMS,
  contact: INITIAL_CONTACT_CMS,
  footer: INITIAL_FOOTER_CMS,
  header: INITIAL_HEADER_CMS,
};
