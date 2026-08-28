export type NavTab = 
  | 'inquiries'
  | 'deployments'
  | 'cms'
  | 'settings';

// =========================================================================
// 1. CONTACT SUBMISSIONS (KANBAN CRM & INQUIRIES)
// =========================================================================
export type InquiryStatus = 
  | 'NEW'
  | 'QUALIFYING'
  | 'PROPOSAL_SENT'
  | 'IN_NEGOTIATION'
  | 'WON'
  | 'LOST'
  | 'UNREAD'
  | 'IN_REVIEW'
  | 'CONTACTED'
  | 'MILESTONE_ACTIVE'
  | 'CLOSED'
  | 'ARCHIVED';

export type SubmissionStatus = InquiryStatus;

export type InquiryPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';

export type BudgetTier = 
  | '<$5,000'
  | '$5,000 - $15,000'
  | '$15,000 - $30,000'
  | '$30,000 - $60,000'
  | '$60,000+'
  | '$1k - $3k (Micro Deployment)'
  | '$3k - $7k (Full Web App)'
  | '$7k - $15k (Enterprise Architecture)'
  | '$15k+ (Bespoke Retainer / Studio Partner)'
  | string;

export interface ContactSubmission {
  id: string;
  name?: string;
  clientName: string;
  email: string;
  company?: string;
  projectType?: string;
  serviceType?: string;
  budget?: string;
  budgetRange?: string;
  budgetTier: BudgetTier | string;
  timeline?: string;
  message?: string;
  projectBrief: string;
  projectSummary?: string;
  status: InquiryStatus;
  priority?: InquiryPriority;
  read?: boolean;
  flagged?: boolean;
  tags?: string[];
  assignedArchitect?: string;
  internalNotes?: string;
  submittedAt?: string;
  date: string;
  avatar?: string;
}

// Backward compatibility alias
export type InquiryItem = ContactSubmission;

// =========================================================================
// 2. CLIENT REVIEWS & MODERATION
// =========================================================================
export interface ReviewItem {
  id: string;
  name: string;
  author?: string; // Alias for name
  email?: string;
  role?: string;
  company?: string;
  roleCompany: string; // e.g. "Managing Partner, Sterling Capital"
  rating: number; // 1-5
  starRating?: number; // 1-5
  comment: string;
  quote?: string; // Alias for comment
  avatarUrl?: string;
  dateString: string;
  isVerified: boolean;
  isApproved: boolean; // toggle for public site display
  isFeatured?: boolean; // toggle for featured review
  createdAt?: string;
}

// Backward compatibility alias
export type ClientReview = ReviewItem;

// =========================================================================
// 3. DEPLOYMENT PRODUCTS (PORTFOLIO CATALOG & LIVE WEBSITE SCHEMA)
// =========================================================================
export type DeploymentCategory = 
  | 'SAAS DASHBOARDS'
  | 'UI TEMPLATES'
  | 'FULL-STACK APPS'
  | 'ANIMATED SITES'
  | 'SaaS Dashboards'
  | 'UI Templates'
  | 'Full-Stack Apps'
  | 'Animated Sites'
  | string;

export type DeploymentStatus = 'Production' | 'Staging' | 'Archived';

export interface MetricKeyValuePair {
  key: string;
  value: string;
}

export interface TechnicalMetric {
  label: string;
  value: string;
}

export interface DeploymentProduct {
  // Basic Information
  id: string;
  slug?: string;
  title: string;
  category: DeploymentCategory;
  badge?: string; // e.g. 'FEATURED', 'NEW', 'POPULAR', 'PRO'
  badgeLabel?: string; // Alias for badge
  isFeatured: boolean;

  // Descriptions & Media
  shortDescription: string;
  fullDescription?: string;
  thumbnailUrl: string;
  coverImageUrl?: string;
  previewVideoUrl?: string | null;

  // Links
  demoUrl?: string;
  githubUrl?: string;
  sourceUrl?: string; // Alias for githubUrl
  liveUrl?: string;

  // Stats & Ratings
  rating?: number; // e.g. 4.9
  usersCount?: string; // e.g. '14.2k+'
  viewsCount?: string; // e.g. '98k'

  // Technical Metadata
  tags?: string[]; // e.g. ["React", "Tailwind", "Three.js"]
  techStack: string[]; // e.g. ["Next.js", "WebGL", "TypeScript"]
  features?: string[] | MetricKeyValuePair[]; // Feature bullet points for detail modal
  technicalMetrics?: TechnicalMetric[]; // e.g. [{ label: "Bundle Size", value: "42kb" }]

  // Relational & Extended Metadata
  client?: string;
  year?: string;
  metrics?: string[];
  fpsBenchmark?: number; // e.g. 60
  auditScore?: number; // e.g. 100
  status?: DeploymentStatus;
  displayOrder?: number;
  lastDeployed?: string;
  published?: boolean;
  isPublished?: boolean;
}

// Backward compatibility alias
export type PortfolioDeploymentItem = DeploymentProduct;

// =========================================================================
// 3B. ENGINEERING LAB CMS
// =========================================================================
export interface LabDemoCard {
  id: string;
  title: string;
  category: string;
  status: 'ONLINE' | 'ACTIVE' | 'EXPERIMENTAL' | 'BETA' | 'STABLE';
  benchmarkStats: string;
  description: string;
  codeSnippet: string;
  displayOrder: number;
  accentColor?: string;
}

export interface EngineeringLabContent {
  id?: string;
  badgeText: string;
  sectionTitle: string;
  sectionSubtitle: string;
  systemStatus: string;
  targetFps: number;
  memoryBudget: string;
  shaderCompiles: string;
  activeShadersCount: number;
  demoCards: LabDemoCard[];
}

// =========================================================================
// 3C. STORY & ABOUT MILESTONES TIMELINE
// =========================================================================
export interface MilestoneCard {
  id: string;
  year: string;
  phase: string;
  title: string;
  subtitle?: string;
  description: string;
  thumbnail: string;
  highlightTag?: string;
  tags?: string[];
  displayOrder: number;
}

// =========================================================================
// 4. STORY STAGES CMS (RELATIONAL ENTITIES)
// =========================================================================
export interface ArchitectureNode {
  id: string;
  key?: string;
  name?: string;
  label?: string;
  role?: string;
  latency?: string;
  summary?: string;
  description?: string;
  techSpecs?: string;
  benchmarkMetric?: string;
  order?: number;
  status?: 'active' | 'idle' | 'syncing' | 'OPTIMAL' | 'DEGRADED' | 'STANDBY' | string;
  icon?: string;
}

export interface EscrowPhase {
  id: string;
  phaseNumber: number | string;
  title: string;
  description: string;
  badgeText?: string;
  verificationCriteria?: string;
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'LOCKED' | 'RELEASED' | string;
  allocationPercentage?: number;
}

export interface StoryStageContent {
  id: string;
  stageIndex: number; // 0, 1, 2, 3
  phase?: string;
  year?: string;
  title?: string;
  subtitle?: string;
  description: string;
  highlightTag?: string;
  tags?: string[];
  displayOrder?: number;
  stageBadge?: string; // e.g. "01 // ARCHITECTURAL MASTERY"
  headlineLine1?: string;
  headlineLine2?: string;
  specTag1Title?: string;
  specTag1Sub?: string;
  specTag2Title?: string;
  specTag2Sub?: string;
  specTag3Title?: string;
  specTag3Sub?: string;
  bulletPoints?: string[];
  defaultTension?: number; // default: 320
  defaultDamping?: number; // default: 24
  primaryCtaLabel?: string;
  primaryCtaRoute?: string;
  secondaryCtaLabel?: string;
  secondaryCtaRoute?: string;
  architectureNodes?: ArchitectureNode[];
  escrowPhases?: EscrowPhase[];
}

// Backward compatibility alias
export type StoryStageConfig = StoryStageContent;
export type StoryStage = StoryStageContent;

// =========================================================================
// 5. HERO CMS CONFIG (HERO SECTION CONTENT)
// =========================================================================
export interface HeroSectionContent {
  id?: string;
  brandLogoText?: string;
  badgeText?: string;
  superTitle?: string;
  mainHeading?: string;
  mainTitle?: string;
  highlightedWord?: string;
  subheading?: string;
  subtitle?: string;
  primaryCtaText?: string;
  primaryCtaUrl?: string;
  secondaryCtaText?: string;
  telemetryStatus?: string;
  telemetryLatency?: string;
  telemetryUptime?: string;
  topBadgeText?: string;
  headlineLine1?: string;
  headlineLine2?: string;
  headlineLine3?: string;
  bioSubtext?: string;
  highlightWords?: string[];
  primaryCtaLabel?: string;
  primaryCtaRoute?: string;
  secondaryCtaLabel?: string;
  secondaryCtaRoute?: string;
  pricingNoticeText?: string;
  fpsBadgeText?: string;
  pingBadgeText?: string;
  livePercentBadgeText?: string;
  nodeCountText?: string;
  particleModes?: string[];
  defaultParticleMode?: string;
  baseNodeCount?: number;
  targetFps?: number;
  updatedAt?: string;
}

// Backward compatibility alias
export type HeroConfig = HeroSectionContent;
export type HeroContent = HeroSectionContent;

export interface SiteHeaderConfig {
  brandName: string;
  brandLogoText?: string;
  brandTagline?: string;
  studioTitle?: string;
  studioSubtitle?: string;
  isOnline?: boolean;
  liveBadgeStatus?: string;
  pingLatency?: string;
  primaryColorHex?: string;
  headerCtaLabel?: string;
  navLinks?: Array<{ id: string; label: string; route: string; isExternal?: boolean; isPrimary?: boolean }>;
}

export interface FooterContent {
  tagline: string;
  contactEmail?: string;
  telegramHandle?: string;
  discordHandle?: string;
  githubUrl?: string;
  twitterUrl?: string;
  copyrightText?: string;
  copyrightStatement?: string;
  copyright?: string;
  bottomBadgeLeft?: string;
  bottomBadgeRight?: string;
  disclaimerText?: string;
  directEmail?: string;
  socialDribbble?: string;
  socialGithub?: string;
  socialDiscord?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
  socialTelegram?: string;
  socialLinks?: {
    email?: string;
    fiverr?: string;
    dribbble?: string;
    twitter?: string;
    whatsapp?: string;
    github?: string;
    linkedin?: string;
    discord?: string;
    telegram?: string;
  };
}

export interface SiteConfig {
  brandName: string;
  studioTitle: string;
  isOnline: boolean;
  liveBadgeStatus?: string;
  pingLatency?: string;
  primaryColorHex?: string;
  directEmail: string;
  tagline: string;
  copyright: string;
  socialDribbble?: string;
  socialGithub?: string;
  socialDiscord?: string;
  socialTwitter?: string;
  socialLinkedin?: string;
  socialTelegram?: string;
}

// =========================================================================
// 7. ABOUT & PROOF METRICS
// =========================================================================
export interface ProofMetricCard {
  id: string;
  cardKey?: string;
  metricKey?: string;
  title?: string;
  value: string;
  label?: string;
  subtext: string;
  icon?: string;
  percentage?: number;
  category?: string;
  displayOrder?: number;
}

export interface AboutPageContent {
  artistName: string;
  profileName?: string;
  handle: string;
  role: string;
  title?: string;
  tagline?: string;
  shortBio?: string; // Alias for tagline used in CMS editor
  executiveBio: string;
  avatarUrl?: string;
  location: string;
  locationTimezone?: string;
  availability: string;
  availabilityStatus?: string;
  yearsActive?: string;
  deploymentsDelivered?: string;
  clientSatisfaction?: string;
  techSkills: string[];
  directEmail?: string;
  contactEmail?: string;
  timeZone?: string;
  proofMetrics: ProofMetricCard[];
}

// Backward compatibility alias
export type AboutConfig = AboutPageContent;
export type AboutContent = AboutPageContent;
export type ProofMetric = ProofMetricCard;

// =========================================================================
// 8. CONTACT PORTALS & CHANNELS
// =========================================================================
export interface ContactChannelCard {
  id: string;
  channelKey: string;
  label: string;
  value: string;
  linkUrl: string;
  badge?: string;
  isEnabled: boolean;
}

export interface ContactPageContent {
  headline: string;
  subtitle: string;
  directEmail: string;
  budgetTierOptions: string[];
  channels: ContactChannelCard[];
  telegramHandle?: string;
  discordHandle?: string;
  githubUrl?: string;
  twitterUrl?: string;
}

// Backward compatibility alias
export type ContactConfig = ContactPageContent;

// =========================================================================
// 9. FAQ ITEMS & FAQ SECTION HEADER CONTENT
// =========================================================================
export type FaqCategory = 'General' | 'Architecture' | 'Development' | 'Pricing & Escrow' | 'Support' | string;

export interface FaqSectionContent {
  id?: string;
  badgeText: string;
  pageTitle: string;
  pageSubtitle: string;
  searchPlaceholder: string;
  supportEmail?: string;
  telemetry1Title?: string;
  telemetry1Sub?: string;
  telemetry2Title?: string;
  telemetry2Sub?: string;
  telemetry3Title?: string;
  telemetry3Sub?: string;
  telemetry4Title?: string;
  telemetry4Sub?: string;
  categories: FaqCategory[];
  updatedAt?: string;
}

export type FaqHeaderConfig = FaqSectionContent;

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
  categoryTag?: string;
  orderIndex?: number;
  displayOrder?: number;
  helpfulCount?: number;
  isPublished: boolean;
}

export type FAQItem = FaqItem;

export interface MasterWebsiteCustomizerData {
  deployments: DeploymentProduct[];
  hero: HeroSectionContent;
  lab?: EngineeringLabContent;
  engineeringLab?: EngineeringLabContent;
  milestones: MilestoneCard[];
  storyStages?: StoryStageContent[];
  stages?: StoryStageContent[];
  about: AboutPageContent;
  reviews: ReviewItem[];
  contact: ContactPageContent;
  footer: FooterContent;
  header: SiteHeaderConfig;
  faqHeader?: FaqSectionContent;
  faqs?: FaqItem[];
}

// =========================================================================
// 11. AI CHAT & SERVER ACTIONS
// =========================================================================
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  chartSuggestion?: {
    title: string;
    type: 'line' | 'bar' | 'pie';
    data: Array<{ name: string; value: number }>;
  };
}

export interface ServerActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  revalidatedPaths?: string[];
  timestamp: string;
}

