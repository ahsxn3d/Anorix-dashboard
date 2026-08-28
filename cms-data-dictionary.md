# Lumaora Headless Studio — CMS Data Dictionary & PostgreSQL Prisma Specification

> **Document Version:** `2.4.0`  
> **Status:** Production Architecture Blueprint  
> **Target Database Engine:** PostgreSQL 16+ (Hosted on Neon / Supabase / Cloud SQL)  
> **Target ORM:** Prisma ORM v5+  
> **Scope:** Complete specification of every static text, copy segment, dynamic collection, admin configuration, authentication record, and technical prop across the Lumaora Headless Studio ecosystem.

---

## Table of Contents
1. [Architecture & Schema Strategy Overview](#1-architecture--schema-strategy-overview)
2. [Global Navigation, Header & Footer Settings](#2-global-navigation-header--footer-settings)
3. [Page-Level Content & Static Copy](#3-page-level-content--static-copy)
   - [3.1 Hero Section](#31-hero-section)
   - [3.2 Horizontal Story Narrative (Stages 1–4)](#32-horizontal-story-narrative-stages-14)
   - [3.3 Core Value Propositions & Service Offerings](#33-core-value-propositions--service-offerings)
   - [3.4 About & Philosophy Section](#34-about--philosophy-section)
   - [3.5 FAQ Static Copy & Header](#35-faq-static-copy--header)
   - [3.6 Contact & Inquiries Static Copy](#36-contact--inquiries-static-copy)
   - [3.7 Global Footer](#37-global-footer)
4. [Dynamic Collections & Entity Models](#4-dynamic-collections--entity-models)
   - [4.1 Deployments & Portfolio Projects (`PortfolioDeployment`)](#41-deployments--portfolio-projects-portfoliodeployment)
   - [4.2 Frequently Asked Questions (`FaqItem`)](#42-frequently-asked-questions-faqitem)
   - [4.3 Inquiries & Lead Management (`InquirySubmission`)](#43-inquiries--lead-management-inquirysubmission)
   - [4.4 Admin User & Authentication (`AdminUser`)](#44-admin-user--authentication-adminuser)
   - [4.5 System Preferences & Integrations (`SystemSettings`)](#45-system-preferences--integrations-systemsettings)
5. [Technical Props, Animation Variants & Interaction State Hooks](#5-technical-props-animation-variants--interaction-state-hooks)
6. [Complete Production Prisma Schema (`schema.prisma`)](#6-complete-production-prisma-schema-schemaprisma)

---

## 1. Architecture & Schema Strategy Overview

The Lumaora frontend is powered by a high-performance headless architecture. To transition 100% of the content into a fully headless, editable database backed by PostgreSQL and Prisma ORM, the data layer is partitioned into:

1. **Singleton Configuration Tables**: `SiteConfig`, `HeroSection`, `AboutSection`, `ContactConfig`, `SystemSettings` (single-row configuration records identified by constant keys or standard IDs).
2. **Normalized Relational Collections**: `PortfolioDeployment`, `FaqItem`, `InquirySubmission`, `StoryStage`, `ServiceOffering`, `AdminUser`, `AuditLog`.
3. **Structured JSON / Array Fields**: Used for tags, technical badges, metric arrays, benchmark lists, and multi-line code previews where relational overhead is unnecessary.

---

## 2. Global Navigation, Header & Footer Settings

### Table: `SiteConfig` (Singleton `id = "global_config"`)

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Logo Text** | `"Lumaora"` | `logoText` | `String` | `SiteConfig` | No |
| **Logo Sub-Tag / Badge** | `"STUDIO"` | `logoBadge` | `String` | `SiteConfig` | No |
| **Brand Tagline / Subtitle** | `"Headless CMS & Studio"` | `tagline` | `String` | `SiteConfig` | No |
| **System Status Text** | `"Solo Studio Active"` | `systemStatusText` | `String` | `SiteConfig` | No |
| **System Status State** | `"ACTIVE"` | `systemStatusState` | `SystemStatusEnum` | `SiteConfig` | No |
| **Primary Nav Links** | `[{"label": "Inquiries", "route": "inquiries", "badge": "5 New"}, {"label": "Deployments", "route": "deployments", "badge": "Live"}, {"label": "Website CMS", "route": "cms", "badge": "Edit"}, {"label": "Settings", "route": "settings"}]` | `navItems` | `Json` | `SiteConfig` | No |
| **Primary Action Button Label** | `"Deploy Project"` | `primaryCtaLabel` | `String` | `SiteConfig` | No |
| **Primary Action Button URL** | `"/contact"` | `primaryCtaUrl` | `String` | `SiteConfig` | No |
| **Secondary Action Button Label**| `"View Live Deployments"` | `secondaryCtaLabel` | `String` | `SiteConfig` | No |
| **Secondary Action Button URL** | `"/deployments"` | `secondaryCtaUrl` | `String` | `SiteConfig` | No |
| **AI Assistant Drawer Title** | `"InsightAI Analyst"` | `aiAssistantTitle` | `String` | `SiteConfig` | No |
| **AI Assistant Subtitle** | `"Your AI Data Analyst"` | `aiAssistantSubtitle`| `String` | `SiteConfig` | No |
| **Created At Timestamp** | `now()` | `createdAt` | `DateTime` | `SiteConfig` | No |
| **Updated At Timestamp** | `now()` | `updatedAt` | `DateTime` | `SiteConfig` | No |

---

## 3. Page-Level Content & Static Copy

### 3.1 Hero Section
#### Table: `HeroSection` (Singleton `id = "hero_config"`)

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Top Category Tag** | `"BESPOKE DIGITAL ENGINEERING"` | `topCategoryTag` | `String` | `HeroSection` | No |
| **Title Prefix Segment** | `"Crafting Architectural"` | `titlePrefix` | `String` | `HeroSection` | No |
| **Title Highlight Segment** | `"Web Platforms"` | `titleHighlight` | `String` | `HeroSection` | No |
| **Title Suffix Segment** | `"& Immersive Systems"` | `titleSuffix` | `String` | `HeroSection` | No |
| **Hero Pitch Subtitle** | `"We architect bespoke web experiences, scalable SaaS dashboards, and high-performance digital systems for ambitious brands worldwide."` | `subtitle` | `String` | `HeroSection` | No |
| **Primary Action Button Label** | `"Initiate Deployment"` | `primaryActionLabel`| `String` | `HeroSection` | No |
| **Primary Action Target Route** | `"/contact"` | `primaryActionRoute`| `String` | `HeroSection` | No |
| **Secondary Action Button Label**| `"Explore Portfolio"` | `secondaryActionLabel`| `String`| `HeroSection` | No |
| **Secondary Action Target Route**| `"/deployments"` | `secondaryActionRoute`| `String`| `HeroSection` | No |
| **Pricing Pre-Qualification Copy**| `"Projects starting from $3,000 • Q3 Intake Active"` | `pricingNotice` | `String` | `HeroSection` | No |
| **Particle Canvas Modes** | `["Dark Prismatic", "Cyber Grid", "Constellation", "Minimal Void"]` | `particleModes` | `String[]` | `HeroSection` | No |
| **Default Particle Mode** | `"Dark Prismatic"` | `defaultParticleMode`| `String` | `HeroSection` | No |

---

### 3.2 Horizontal Story Narrative (Stages 1–4)
#### Table: `StoryStage` (Relational collection mapped by `orderIndex`)

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Stage 1 Identifier** | `"STAGE 01"` | `stageBadge` | `String` | `StoryStage` | No |
| **Stage 1 Headline** | `"Architectural Foundation"` | `headline` | `String` | `StoryStage` | No |
| **Stage 1 Description** | `"Every project starts with a rigorous architectural blueprint. We eliminate bloat, choosing high-velocity Next.js 15 app routers, zero-latency serverless edge functions, and clean type contracts."` | `description` | `String` | `StoryStage` | No |
| **Stage 1 Mock Code Visualizer** | `const lumaora = await Studio.deploy({ edge: true, cache: 'immutable', security: 'zero-trust' });` | `codeSnippet` | `String` | `StoryStage` | Yes |
| **Stage 1 Tech Badges Stack** | `["Next.js 15", "TypeScript 5.5", "Tailwind CSS", "Prisma ORM"]` | `techBadges` | `String[]` | `StoryStage` | No |
| **Stage 1 Order Index** | `1` | `orderIndex` | `Int` | `StoryStage` | No |
| **Stage 2 Identifier** | `"STAGE 02"` | `stageBadge` | `String` | `StoryStage` | No |
| **Stage 2 Headline** | `"Immersive Motion & Micro-Interactions"` | `headline` | `String` | `StoryStage` | No |
| **Stage 2 Description** | `"Dynamic user interfaces with fluid 60fps spring transitions, hardware-accelerated shaders, and precision micro-interactions that captivate modern audiences."` | `description` | `String` | `StoryStage` | No |
| **Stage 2 Feature Bullet Metrics**| `[{"label": "Frame Rate", "value": "60 FPS V-Sync"}, {"label": "GPU Acceleration", "value": "Metal / WebGPU Ready"}]` | `metricsJson` | `Json` | `StoryStage` | Yes |
| **Stage 2 Order Index** | `2` | `orderIndex` | `Int` | `StoryStage` | No |
| **Stage 3 Identifier** | `"STAGE 03"` | `stageBadge` | `String` | `StoryStage` | No |
| **Stage 3 Headline** | `"Extreme Speed & Telemetry Benchmarks"` | `headline` | `String` | `StoryStage` | No |
| **Stage 3 Description** | `"Engineered for sub-100ms response times. We obsess over Lighthouse 100 scores, bundle tree-shaking, and globally replicated edge CDN pipelines."` | `description` | `String` | `StoryStage` | No |
| **Stage 3 Benchmark Badges** | `["Lighthouse 100", "<85KB Gzip", "Sub-10ms TTFB", "Zero CLS"]` | `techBadges` | `String[]` | `StoryStage` | No |
| **Stage 3 Order Index** | `3` | `orderIndex` | `Int` | `StoryStage` | No |
| **Stage 4 Identifier** | `"STAGE 04"` | `stageBadge` | `String` | `StoryStage` | No |
| **Stage 4 Headline** | `"Continuous Deployment & Headless Scaling"` | `headline` | `String` | `StoryStage` | No |
| **Stage 4 Description** | `"Automated zero-downtime deployments with instant preview branches, server-side caching rollouts, and enterprise-grade PostgreSQL persistence."` | `description` | `String` | `StoryStage` | No |
| **Stage 4 Deployment Terminal Mock**| `"[SYS] Container spin-up: 42ms\n[TLS] Automated SSL provisioned\n[DB] PostgreSQL Prisma Pool: HEALTHY\n[STATUS] Live at edge nodes globally."` | `codeSnippet` | `String` | `StoryStage` | Yes |
| **Stage 4 Order Index** | `4` | `orderIndex` | `Int` | `StoryStage` | No |

---

### 3.3 Core Value Propositions & Service Offerings
#### Table: `ServiceOffering`

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Service 1 Title** | `"Architecture & High-Performance Web"` | `title` | `String` | `ServiceOffering` | No |
| **Service 1 Slug** | `"web-architecture"` | `slug` | `String` | `ServiceOffering` | No |
| **Service 1 Tagline** | `"Modern frontend architectures designed for extreme performance, high Lighthouse scores, and effortless maintainability."` | `description` | `String` | `ServiceOffering` | No |
| **Service 1 Feature Items** | `["Next.js App Router & React 19", "Sub-100ms Edge TTFB", "Strict TypeScript Contracts", "Modular Atomic Design"]` | `features` | `String[]` | `ServiceOffering` | No |
| **Service 1 Icon Name** | `"Globe"` | `iconName` | `String` | `ServiceOffering` | No |
| **Service 1 Order Index** | `1` | `orderIndex` | `Int` | `ServiceOffering` | No |
| **Service 2 Title** | `"Full-Stack SaaS Platforms & Dashboards"` | `title` | `String` | `ServiceOffering` | No |
| **Service 2 Slug** | `"saas-platforms"` | `slug` | `String` | `ServiceOffering` | No |
| **Service 2 Tagline** | `"End-to-end web applications with robust authentication, role-based access control, real-time WebSockets, and database pipelines."` | `description` | `String` | `ServiceOffering` | No |
| **Service 2 Feature Items** | `["Real-Time Telemetry Feeds", "Role-Based Access Control (RBAC)", "PostgreSQL & Prisma Integration", "Automated Billing & Webhooks"]` | `features` | `String[]` | `ServiceOffering` | No |
| **Service 2 Icon Name** | `"LayoutDashboard"` | `iconName` | `String` | `ServiceOffering` | No |
| **Service 2 Order Index** | `2` | `orderIndex` | `Int` | `ServiceOffering` | No |
| **Service 3 Title** | `"Interactive 3D & Video-Animated Experiences"`| `title` | `String` | `ServiceOffering` | No |
| **Service 3 Slug** | `"interactive-experiences"` | `slug` | `String` | `ServiceOffering` | No |
| **Service 3 Tagline** | `"Cinematic web experiences incorporating motion graphics, high-framerate interactions, and immersive spatial visualizers."` | `description` | `String` | `ServiceOffering` | No |
| **Service 3 Feature Items** | `["Motion & Spring Physics Engine", "Hardware Accelerated Canvas", "Spatial Audio Integration", "Fluid 60fps Micro-Animations"]` | `features` | `String[]` | `ServiceOffering` | No |
| **Service 3 Icon Name** | `"Sparkles"` | `iconName` | `String` | `ServiceOffering` | No |
| **Service 3 Order Index** | `3` | `orderIndex` | `Int` | `ServiceOffering` | No |
| **Service 4 Title** | `"Headless CMS & Custom Digital Infrastructure"`| `title` | `String` | `ServiceOffering` | No |
| **Service 4 Slug** | `"headless-cms"` | `slug` | `String` | `ServiceOffering` | No |
| **Service 4 Tagline** | `"Tailored content management backends allowing creative teams to update 100% of website content without developer intervention."` | `description` | `String` | `ServiceOffering` | No |
| **Service 4 Feature Items** | `["Live Preview Synchronization", "Granular Admin Permissions", "Instant Edge CDN Invalidation", "GraphQL & REST Ingestion APIs"]` | `features` | `String[]` | `ServiceOffering` | No |
| **Service 4 Icon Name** | `"Database"` | `iconName` | `String` | `ServiceOffering` | No |
| **Service 4 Order Index** | `4` | `orderIndex` | `Int` | `ServiceOffering` | No |

---

### 3.4 About & Philosophy Section
#### Table: `AboutSection` (Singleton `id = "about_config"`)

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Section Identifier Tag** | `"ABOUT LUMAORA STUDIO"` | `sectionTag` | `String` | `AboutSection` | No |
| **Bio Primary Headline** | `"A boutique digital engineering studio dedicated to craftsmanship and architectural clarity."` | `bioHeadline` | `String` | `AboutSection` | No |
| **Bio Subtext Description** | `"Crafting high-performance web architectures, scalable SaaS dashboards, and immersive video-animated interfaces for modern digital brands."` | `bioSubtext` | `String` | `AboutSection` | No |
| **Lead Architect Name** | `"Ahsan Javed"` | `leadArchitectName` | `String` | `AboutSection` | No |
| **Lead Architect Title** | `"Principal Systems Architect"` | `leadArchitectTitle`| `String` | `AboutSection` | No |
| **Lead Architect Avatar** | `"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"` | `leadArchitectAvatar`| `String` | `AboutSection` | No |
| **Philosophy Pillar 1 (Title/Body)**| `{"title": "Relentless Performance", "text": "We consider load time a core product feature. Every byte is justified, every asset optimized."}` | `pillar1` | `Json` | `AboutSection` | No |
| **Philosophy Pillar 2 (Title/Body)**| `{"title": "Zero-Compromise Design", "text": "Interfaces should feel alive. We craft mathematical micro-interactions that elevate brand trust."}` | `pillar2` | `Json` | `AboutSection` | No |
| **Philosophy Pillar 3 (Title/Body)**| `{"title": "Future-Proof Architecture", "text": "Built with modern type systems, edge deployments, and clean headless CMS foundations."}` | `pillar3` | `Json` | `AboutSection` | No |
| **Frontend Tech Stack** | `["React 19", "Next.js 15", "TypeScript", "Tailwind CSS", "Motion"]` | `techStackFrontend` | `String[]` | `AboutSection` | No |
| **Backend Tech Stack** | `["Node.js", "Express", "GraphQL", "REST APIs", "Serverless Edge"]` | `techStackBackend` | `String[]` | `AboutSection` | No |
| **Database & Cache Stack** | `["PostgreSQL", "Neon Serverless", "Prisma ORM", "Redis Edge Cache"]` | `techStackDatabase` | `String[]` | `AboutSection` | No |
| **Cloud & DevOps Stack** | `["Cloud Run", "Vercel Enterprise", "Docker Containers", "GitHub Actions"]` | `techStackDevOps` | `String[]` | `AboutSection` | No |

---

### 3.5 FAQ Static Copy & Header
#### Table: `FaqSectionConfig` (Singleton `id = "faq_config"`)

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **FAQ Section Category Tag** | `"FREQUENTLY ASKED QUESTIONS"` | `categoryTag` | `String` | `FaqSectionConfig` | No |
| **FAQ Main Title** | `"Clear answers on our architecture, workflow, and pricing."` | `title` | `String` | `FaqSectionConfig` | No |
| **FAQ Subtitle Pitch** | `"Everything you need to know before initiating a studio engagement with Lumaora."` | `subtitle` | `String` | `FaqSectionConfig` | No |
| **Filter Categories Available** | `["All", "Services", "Architecture", "Pricing & Process"]` | `filterCategories` | `String[]` | `FaqSectionConfig` | No |

---

### 3.6 Contact & Inquiries Static Copy
#### Table: `ContactSectionConfig` (Singleton `id = "contact_config"`)

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Section Tag** | `"INITIATE ENGAGEMENT"` | `sectionTag` | `String` | `ContactSectionConfig` | No |
| **Contact Main Headline** | `"Let's Build Something Exceptional"` | `headline` | `String` | `ContactSectionConfig` | No |
| **Contact Subtitle Description** | `"We are currently booking Q3 / Q4 projects. Share your requirements below to receive an architectural scope and fixed estimate within 24 hours."` | `subtitle` | `String` | `ContactSectionConfig` | No |
| **Budget Tier Option 1** | `"$1k - $3k (Micro Deployment)"` | `budgetTier1` | `String` | `ContactSectionConfig` | No |
| **Budget Tier Option 2** | `"$3k - $7k (Full Web App)"` | `budgetTier2` | `String` | `ContactSectionConfig` | No |
| **Budget Tier Option 3** | `"$7k - $15k (Enterprise Architecture)"` | `budgetTier3` | `String` | `ContactSectionConfig` | No |
| **Budget Tier Option 4** | `"$15k+ (Bespoke Retainer / Studio Partner)"` | `budgetTier4` | `String` | `ContactSectionConfig` | No |
| **Direct Contact Email** | `"ahsxn3d@gmail.com"` | `contactEmail` | `String` | `ContactSectionConfig` | No |
| **Twitter / X Handle & URL** | `"@ahsxn3d" / "https://x.com/ahsxn3d"` | `socialTwitter` | `String` | `ContactSectionConfig` | Yes |
| **GitHub Profile URL** | `"https://github.com/ahsxn3d"` | `socialGithub` | `String` | `ContactSectionConfig` | Yes |
| **Discord Server / Tag** | `"lumaora.studio"` | `socialDiscord` | `String` | `ContactSectionConfig` | Yes |
| **LinkedIn Profile URL** | `"https://linkedin.com/in/ahsxn3d"` | `socialLinkedin` | `String` | `ContactSectionConfig` | Yes |
| **Physical HQ Location** | `"San Francisco, CA (Remote PST)"` | `locationHq` | `String` | `ContactSectionConfig` | No |
| **Operating Timezone** | `"PST (UTC-8) • 24h Inquiry Response Guarantee"` | `operatingTimezone` | `String` | `ContactSectionConfig` | No |

---

### 3.7 Global Footer
#### Table: `FooterConfig` (Singleton `id = "footer_config"`)

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Statement** | `"Lumaora Studio — Engineered for Extreme Performance, Immersive Motion, and Headless Flexibility."` | `brandStatement` | `String` | `FooterConfig` | No |
| **Copyright Notice** | `"© 2026 Lumaora Headless Studio. All rights reserved."` | `copyrightText` | `String` | `FooterConfig` | No |
| **Privacy Policy URL** | `"/privacy"` | `privacyUrl` | `String` | `FooterConfig` | No |
| **Terms of Service URL** | `"/terms"` | `termsUrl` | `String` | `FooterConfig` | No |
| **Security Status Indicator** | `"Zero-Trust SSL • Global Edge Network"` | `securityNotice` | `String` | `FooterConfig` | No |

---

## 4. Dynamic Collections & Entity Models

### 4.1 Deployments & Portfolio Projects (`PortfolioDeployment`)
#### Table: `PortfolioDeployment`
This collection represents the portfolio projects displayed in `/deployments` and the interactive project showcase.

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unique ID** | `"dep-001"` (Primary Key) | `id` | `String` (`@id @default(cuid())`) | `PortfolioDeployment` | No |
| **Project Title** | `"Aether Cloud Infrastructure"` | `title` | `String` | `PortfolioDeployment` | No |
| **URL Slug** | `"aether-cloud"` (Unique) | `slug` | `String` (`@unique`) | `PortfolioDeployment` | No |
| **Client Name** | `"Aether Labs Inc."` | `client` | `String` | `PortfolioDeployment` | No |
| **Year Produced** | `"2026"` | `year` | `String` | `PortfolioDeployment` | No |
| **Category Tag** | `"Web Architecture / SaaS"` | `category` | `String` | `PortfolioDeployment` | No |
| **Live Production URL** | `"https://aether-cloud.example.com"` | `liveUrl` | `String` | `PortfolioDeployment` | Yes |
| **Source Code Repository** | `"https://github.com/lumaora/aether-cloud"` | `githubUrl` | `String` | `PortfolioDeployment` | Yes |
| **Thumbnail Image URL** | `"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80"` | `thumbnail` | `String` | `PortfolioDeployment` | No |
| **Cover Image URL (Full HD)** | `"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80"` | `coverImage` | `String` | `PortfolioDeployment` | Yes |
| **Short Summary** | `"Distributed telemetry monitoring platform for edge compute nodes with real-time anomaly alerts."` | `summary` | `String` | `PortfolioDeployment` | No |
| **Full Project Description** | `"Architected a low-latency edge dashboard with sub-10ms WebSocket data streaming, custom metric chart visualizers, and zero-trust authentication."` | `fullDescription` | `String` (`@db.Text`) | `PortfolioDeployment` | Yes |
| **Tech Stack Tag List** | `["Next.js 15", "TypeScript", "Tailwind CSS", "Prisma", "PostgreSQL", "WebSockets"]` | `techStack` | `String[]` | `PortfolioDeployment` | No |
| **Telemetry Impact Metrics** | `["+340% Real-Time Ingestion", "<25ms Global TTFB", "99.99% Node Uptime"]` | `metrics` | `String[]` | `PortfolioDeployment` | No |
| **Deployment Status** | `"Production"` / `"Staging"` / `"Archived"` | `status` | `DeploymentStatusEnum` | `PortfolioDeployment` | No |
| **Featured Showcase Flag** | `true` | `featured` | `Boolean` (`@default(false)`) | `PortfolioDeployment` | No |
| **Display Sort Order** | `1` | `orderIndex` | `Int` (`@default(0)`) | `PortfolioDeployment` | No |
| **Created At Timestamp** | `now()` | `createdAt` | `DateTime` (`@default(now())`) | `PortfolioDeployment` | No |
| **Updated At Timestamp** | `now()` | `updatedAt` | `DateTime` (`@updatedAt`) | `PortfolioDeployment` | No |

---

### 4.2 Frequently Asked Questions (`FaqItem`)
#### Table: `FaqItem`

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unique ID** | `"faq-001"` (Primary Key) | `id` | `String` (`@id @default(cuid())`) | `FaqItem` | No |
| **FAQ Question** | `"What is your typical project timeline and deployment sprint cycle?"` | `question` | `String` | `FaqItem` | No |
| **FAQ Answer (Markdown)** | `"Micro deployments take 1-2 weeks. Full web applications and custom SaaS platforms typically take 3-6 weeks with weekly preview sprints."` | `answer` | `String` (`@db.Text`) | `FaqItem` | No |
| **Category Classification** | `"Process"` / `"Services"` / `"Architecture"` / `"Pricing"` | `category` | `String` | `FaqItem` | No |
| **Sort Order Index** | `1` | `orderIndex` | `Int` (`@default(0)`) | `FaqItem` | No |
| **Published Status** | `true` | `isPublished` | `Boolean` (`@default(true)`) | `FaqItem` | No |
| **Created At Timestamp** | `now()` | `createdAt` | `DateTime` (`@default(now())`) | `FaqItem` | No |
| **Updated At Timestamp** | `now()` | `updatedAt` | `DateTime` (`@updatedAt`) | `FaqItem` | No |

---

### 4.3 Inquiries & Lead Management (`InquirySubmission`)
#### Table: `InquirySubmission`
Stores all inbound prospective client project briefs and syncs with the Admin Kanban Board.

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Unique Lead ID** | `"inq-001"` (Primary Key) | `id` | `String` (`@id @default(cuid())`) | `InquirySubmission` | No |
| **Client Full Name** | `"Elena Rostova"` | `clientName` | `String` | `InquirySubmission` | No |
| **Official Email Address** | `"elena@cybernetics-corp.io"` | `email` | `String` | `InquirySubmission` | No |
| **Company / Studio Name** | `"Cybernetics Corp"` | `company` | `String` | `InquirySubmission` | Yes |
| **Budget Tier (Strict String)** | `"$7k - $15k (Enterprise Architecture)"` | `budgetTier` | `BudgetTierEnum` | `InquirySubmission` | No |
| **Detailed Project Brief** | `"Need an ultra-high performance 3D product showcase with dynamic shaders for quantum computing lineup..."` | `projectBrief` | `String` (`@db.Text`) | `InquirySubmission` | No |
| **Avatar Photo URL** | `"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"` | `avatar` | `String` | `InquirySubmission` | Yes |
| **Submission Display Date** | `"Aug 03, 2026"` | `dateFormatted` | `String` | `InquirySubmission` | No |
| **Kanban Pipeline Status** | `"New"` / `"In Progress"` / `"Completed"` / `"Canceled"` | `status` | `InquiryStatusEnum` | `InquirySubmission` | No |
| **Internal Admin Notes** | `"Follow up regarding edge shader rendering support on mobile WebGL."` | `internalNotes` | `String` (`@db.Text`) | `InquirySubmission` | Yes |
| **Created At Timestamp** | `now()` | `createdAt` | `DateTime` (`@default(now())`) | `InquirySubmission` | No |
| **Updated At Timestamp** | `now()` | `updatedAt` | `DateTime` (`@updatedAt`) | `InquirySubmission` | No |

---

### 4.4 Admin User & Authentication (`AdminUser`)
#### Table: `AdminUser`
Manages master studio administrator accounts, Google OAuth identities, and 2FA credentials.

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **User ID** | `"usr-master-01"` (Primary Key) | `id` | `String` (`@id @default(cuid())`) | `AdminUser` | No |
| **Full Name** | `"Ahsan Javed"` | `name` | `String` | `AdminUser` | No |
| **Email Address** | `"ahsxn3d@gmail.com"` (Unique) | `email` | `String` (`@unique`) | `AdminUser` | No |
| **Job Title / Role Label** | `"Head of E-Commerce Operations"` | `jobTitle` | `String` | `AdminUser` | No |
| **Avatar Photo URL** | `"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"` | `avatar` | `String` | `AdminUser` | No |
| **Location & Timezone** | `"San Francisco, CA (Remote PST)"` | `location` | `String` | `AdminUser` | No |
| **Bio & Role Description** | `"Lead platform architect overseeing high-frequency digital workflows..."` | `bioText` | `String` (`@db.Text`) | `AdminUser` | Yes |
| **Security Role** | `"MASTER_ADMIN"` / `"ADMIN"` / `"EDITOR"` | `role` | `AdminRoleEnum` (`@default(MASTER_ADMIN)`) | `AdminUser` | No |
| **Password Hash (Bcrypt/Argon2)**| `"$2a$12$e8Y7z9Q..."` | `passwordHash` | `String` | `AdminUser` | Yes |
| **Google OAuth Subject ID** | `"google-oauth2|109283019283"` | `googleId` | `String` (`@unique`) | `AdminUser` | Yes |
| **Two-Factor TOTP Enabled** | `true` | `twoFactorEnabled` | `Boolean` (`@default(true)`) | `AdminUser` | No |
| **Two-Factor Secret (Encrypted)** | `"JBSWY3DPEHPK3PXP"` | `twoFactorSecret` | `String` | `AdminUser` | Yes |
| **Emergency 2FA Backup Codes** | `["8291-0293", "9182-3841", "7129-8371", "4102-9381"]` | `backupCodes` | `String[]` | `AdminUser` | No |
| **Created At Timestamp** | `now()` | `createdAt` | `DateTime` (`@default(now())`) | `AdminUser` | No |
| **Updated At Timestamp** | `now()` | `updatedAt` | `DateTime` (`@updatedAt`) | `AdminUser` | No |

---

### 4.5 System Preferences & Integrations (`SystemSettings`)
#### Table: `SystemSettings` (Singleton `id = "system_settings_singleton"`)

| Field Label / Description | Exact Current Value in Codebase | Prisma Field Name | Prisma Data Type | Target DB Table | Nullable / Optional? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Singleton Primary Key** | `"system_settings_singleton"` | `id` | `String` (`@id`) | `SystemSettings` | No |
| **Neon PostgreSQL Database URL** | `"postgresql://username:password@ep-your-neon-host.aws.neon.tech/neondb?sslmode=require"` | `neonDbUrl` | `String` | `SystemSettings` | No |
| **Gemini AI API Key** | `"AIzaSy_YOUR_GEMINI_API_KEY_PLACEHOLDER"` | `geminiApiKey` | `String` | `SystemSettings` | Yes |
| **Google OAuth Client ID** | `"YOUR_GOOGLE_OAUTH_CLIENT_ID.apps.googleusercontent.com"` | `googleClientId` | `String` | `SystemSettings` | Yes |
| **Google OAuth Client Secret** | `"GOCSPX_YOUR_GOOGLE_CLIENT_SECRET_PLACEHOLDER"` | `googleClientSecret`| `String` | `SystemSettings` | Yes |
| **UploadThing Secret Key** | `"YOUR_UPLOADTHING_TOKEN_PLACEHOLDER"` | `uploadThingSecret` | `String` | `SystemSettings` | Yes |
| **SMTP Host Endpoint** | `"smtp.sendgrid.net:587"` | `smtpHost` | `String` | `SystemSettings` | Yes |
| **SMTP Username** | `"apikey"` | `smtpUser` | `String` | `SystemSettings` | Yes |
| **SMTP Passkey (Encrypted)** | `"SG_YOUR_SMTP_PASSKEY_PLACEHOLDER"` | `smtpPass` | `String` | `SystemSettings` | Yes |
| **Order Events Webhook URL** | `"https://api.anorix.com/v1/webhooks/orders-ingest"` | `webhookEndpoint` | `String` | `SystemSettings` | Yes |
| **Audio Chime Sound Alerts** | `true` | `audioAlerts` | `Boolean` (`@default(true)`) | `SystemSettings` | No |
| **Daily Email Digest** | `true` | `emailDigest` | `Boolean` (`@default(true)`) | `SystemSettings` | No |
| **Browser Push Notifications** | `true` | `pushNotifications` | `Boolean` (`@default(true)`) | `SystemSettings` | No |
| **Primary Theme Accent Color** | `"#a855f7"` | `selectedAccent` | `String` (`@default("#a855f7")`) | `SystemSettings` | No |
| **Maintenance / Read-Only Mode**| `false` | `maintenanceMode` | `Boolean` (`@default(false)`) | `SystemSettings` | No |
| **Audit Log Retention Policy** | `"90_DAYS"` / `"30_DAYS"` / `"180_DAYS"` / `"365_DAYS"` | `logRetention` | `String` (`@default("90_DAYS")`) | `SystemSettings` | No |
| **Updated At Timestamp** | `now()` | `updatedAt` | `DateTime` (`@updatedAt`) | `SystemSettings` | No |

---

## 5. Technical Props, Animation Variants & Interaction State Hooks

### 5.1 Key Frontend State Hooks
1. **`WebsiteCmsData` Hook (`useCmsData`)**:
   - Manages live draft updates, field edits, and publishing changes to PostgreSQL.
   - States: `cmsData`, `activeCmsTab` (`'HOME' | 'DEPLOYMENTS' | 'ABOUT' | 'FAQ' | 'CONTACT'`), `isSaving`, `toastMessage`.
2. **`InquiriesKanban` State Hooks**:
   - `inquiries`: Array of `InquiryItem` records.
   - `budgetFilter`: Filter string (`'ALL' | '$1k - $3k (Micro Deployment)' | '$3k - $7k (Full Web App)' | '$7k - $15k (Enterprise Architecture)' | '$15k+ (Bespoke Retainer / Studio Partner)'`).
   - `viewMode`: `'KANBAN' | 'TABLE'`.
   - `draggedInquiryId`, `dragOverColumn`: Drag-and-drop state management.
3. **`DashboardLoadingScreen` State Hooks**:
   - `progress`: 0% to 100% staggered counter.
   - `currentStepIndex`: Active telemetry step log pointer.
4. **`RightAiAssistant` State Hooks**:
   - `messages`: Array of `ChatMessage` (sender `'ai' | 'user'`, text, timestamp, `chartSuggestion`).
   - `isTyping`: Loading indicator while calling Gemini API.
5. **`GoogleSignInModal` State Hooks**:
   - `selectedAccount`: Primary vs secondary profile selection.
   - `authStep`: `'idle' | 'oauth' | 'verifying' | 'success'`.

### 5.2 Motion & Animation Variants
- **Framer Motion Transition Durations:**
  - Card entry stagger: `0.08s` delay per child card.
  - Kanban card dragging opacity: `0.45` drag ghost with `scale: 1.03`.
  - Ambient Glow Pulse: `animate-pulse` at `3.5s` linear loop.
  - Backdrop Blur: `backdrop-blur-3xl` with `rgba(13, 6, 30, 0.90)`.

---

## 6. Complete Production Prisma Schema (`schema.prisma`)

```prisma
// =============================================================================
// LUMAORA HEADLESS STUDIO — PRODUCTION DATABASE SCHEMA
// Engine: PostgreSQL 16+ (Neon / Supabase / GCP Cloud SQL)
// ORM: Prisma v5+
// =============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -----------------------------------------------------------------------------
// ENUMS
// -----------------------------------------------------------------------------

enum AdminRoleEnum {
  MASTER_ADMIN
  ADMIN
  EDITOR
}

enum InquiryStatusEnum {
  New
  In_Progress  @map("In Progress")
  Completed
  Canceled
}

enum BudgetTierEnum {
  MICRO_DEPLOYMENT       @map("$1k - $3k (Micro Deployment)")
  FULL_WEB_APP           @map("$3k - $7k (Full Web App)")
  ENTERPRISE_ARCHITECTURE @map("$7k - $15k (Enterprise Architecture)")
  BESPOKE_RETAINER       @map("$15k+ (Bespoke Retainer / Studio Partner)")
}

enum DeploymentStatusEnum {
  Production
  Staging
  Archived
}

enum SystemStatusEnum {
  ACTIVE
  MAINTENANCE
  DEGRADED
}

// -----------------------------------------------------------------------------
// 1. GLOBAL & PAGE-LEVEL CONFIGURATION (SINGLETONS)
// -----------------------------------------------------------------------------

model SiteConfig {
  id                  String           @id @default("global_config")
  logoText            String           @default("Lumaora")
  logoBadge           String           @default("STUDIO")
  tagline             String           @default("Headless CMS & Studio")
  systemStatusText    String           @default("Solo Studio Active")
  systemStatusState   SystemStatusEnum @default(ACTIVE)
  navItems            Json
  primaryCtaLabel     String           @default("Deploy Project")
  primaryCtaUrl       String           @default("/contact")
  secondaryCtaLabel   String           @default("View Live Deployments")
  secondaryCtaUrl     String           @default("/deployments")
  aiAssistantTitle    String           @default("InsightAI Analyst")
  aiAssistantSubtitle String           @default("Your AI Data Analyst")
  createdAt           DateTime         @default(now())
  updatedAt           DateTime         @updatedAt

  @@map("site_configs")
}

model HeroSection {
  id                  String   @id @default("hero_config")
  topCategoryTag      String   @default("BESPOKE DIGITAL ENGINEERING")
  titlePrefix         String   @default("Crafting Architectural")
  titleHighlight      String   @default("Web Platforms")
  titleSuffix         String   @default("& Immersive Systems")
  subtitle            String   @db.Text
  primaryActionLabel  String   @default("Initiate Deployment")
  primaryActionRoute  String   @default("/contact")
  secondaryActionLabel String  @default("Explore Portfolio")
  secondaryActionRoute String  @default("/deployments")
  pricingNotice       String   @default("Projects starting from $3,000 • Q3 Intake Active")
  particleModes       String[] @default(["Dark Prismatic", "Cyber Grid", "Constellation", "Minimal Void"])
  defaultParticleMode String   @default("Dark Prismatic")
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("hero_sections")
}

model AboutSection {
  id                  String   @id @default("about_config")
  sectionTag          String   @default("ABOUT LUMAORA STUDIO")
  bioHeadline         String   @db.Text
  bioSubtext          String   @db.Text
  leadArchitectName   String   @default("Ahsan Javed")
  leadArchitectTitle  String   @default("Principal Systems Architect")
  leadArchitectAvatar String
  pillar1             Json
  pillar2             Json
  pillar3             Json
  techStackFrontend   String[]
  techStackBackend    String[]
  techStackDatabase   String[]
  techStackDevOps     String[]
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  @@map("about_sections")
}

model FaqSectionConfig {
  id               String   @id @default("faq_config")
  categoryTag      String   @default("FREQUENTLY ASKED QUESTIONS")
  title            String   @default("Clear answers on our architecture, workflow, and pricing.")
  subtitle         String   @default("Everything you need to know before initiating a studio engagement with Lumaora.")
  filterCategories String[] @default(["All", "Services", "Architecture", "Pricing & Process"])
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@map("faq_section_configs")
}

model ContactSectionConfig {
  id                String   @id @default("contact_config")
  sectionTag        String   @default("INITIATE ENGAGEMENT")
  headline          String   @default("Let's Build Something Exceptional")
  subtitle          String   @db.Text
  budgetTier1       String   @default("$1k - $3k (Micro Deployment)")
  budgetTier2       String   @default("$3k - $7k (Full Web App)")
  budgetTier3       String   @default("$7k - $15k (Enterprise Architecture)")
  budgetTier4       String   @default("$15k+ (Bespoke Retainer / Studio Partner)")
  contactEmail      String   @default("ahsxn3d@gmail.com")
  socialTwitter     String?  @default("@ahsxn3d")
  socialGithub      String?  @default("https://github.com/ahsxn3d")
  socialDiscord     String?  @default("lumaora.studio")
  socialLinkedin    String?  @default("https://linkedin.com/in/ahsxn3d")
  locationHq        String   @default("San Francisco, CA (Remote PST)")
  operatingTimezone String   @default("PST (UTC-8) • 24h Inquiry Response Guarantee")
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@map("contact_section_configs")
}

model FooterConfig {
  id             String   @id @default("footer_config")
  brandStatement String   @db.Text
  copyrightText  String   @default("© 2026 Lumaora Headless Studio. All rights reserved.")
  privacyUrl     String   @default("/privacy")
  termsUrl       String   @default("/terms")
  securityNotice String   @default("Zero-Trust SSL • Global Edge Network")
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@map("footer_configs")
}

// -----------------------------------------------------------------------------
// 2. NARRATIVE & SERVICE COLLECTIONS
// -----------------------------------------------------------------------------

model StoryStage {
  id          String   @id @default(cuid())
  stageBadge  String   // e.g. "STAGE 01"
  headline    String
  description String   @db.Text
  codeSnippet String?  @db.Text
  metricsJson Json?
  techBadges  String[]
  orderIndex  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([orderIndex])
  @@map("story_stages")
}

model ServiceOffering {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String   @db.Text
  features    String[]
  iconName    String
  orderIndex  Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([orderIndex])
  @@map("service_offerings")
}

// -----------------------------------------------------------------------------
// 3. DYNAMIC CONTENT COLLECTIONS
// -----------------------------------------------------------------------------

model PortfolioDeployment {
  id              String               @id @default(cuid())
  title           String
  slug            String               @unique
  client          String
  year            String
  category        String
  liveUrl         String?
  githubUrl       String?
  thumbnail       String
  coverImage      String?
  summary         String               @db.Text
  fullDescription String?              @db.Text
  techStack       String[]
  metrics         String[]
  status          DeploymentStatusEnum @default(Production)
  featured        Boolean              @default(false)
  orderIndex      Int                  @default(0)
  createdAt       DateTime             @default(now())
  updatedAt       DateTime             @updatedAt

  @@index([status])
  @@index([featured])
  @@index([orderIndex])
  @@map("portfolio_deployments")
}

model FaqItem {
  id          String   @id @default(cuid())
  question    String
  answer      String   @db.Text
  category    String   @default("Services")
  orderIndex  Int      @default(0)
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([orderIndex])
  @@index([isPublished])
  @@map("faq_items")
}

model InquirySubmission {
  id            String            @id @default(cuid())
  clientName    String
  email         String
  company       String?
  budgetTier    BudgetTierEnum
  projectBrief  String            @db.Text
  avatar        String?
  dateFormatted String
  status        InquiryStatusEnum @default(New)
  internalNotes String?           @db.Text
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt

  @@index([status])
  @@index([budgetTier])
  @@index([createdAt])
  @@map("inquiry_submissions")
}

// -----------------------------------------------------------------------------
// 4. AUTHENTICATION & SYSTEM SETTINGS
// -----------------------------------------------------------------------------

model AdminUser {
  id               String        @id @default(cuid())
  name             String
  email            String        @unique
  jobTitle         String        @default("Lead Platform Architect")
  avatar           String
  location         String        @default("San Francisco, CA (Remote PST)")
  bioText          String?       @db.Text
  role             AdminRoleEnum @default(MASTER_ADMIN)
  passwordHash     String?
  googleId         String?       @unique
  twoFactorEnabled Boolean       @default(true)
  twoFactorSecret  String?
  backupCodes      String[]      @default([])
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([email])
  @@map("admin_users")
}

model SystemSettings {
  id                 String   @id @default("system_settings_singleton")
  neonDbUrl          String
  geminiApiKey       String?
  googleClientId     String?
  googleClientSecret String?
  uploadThingSecret  String?
  smtpHost           String?  @default("smtp.sendgrid.net:587")
  smtpUser           String?  @default("apikey")
  smtpPass           String?
  webhookEndpoint    String?
  audioAlerts        Boolean  @default(true)
  emailDigest        Boolean  @default(true)
  pushNotifications  Boolean  @default(true)
  selectedAccent     String   @default("#a855f7")
  maintenanceMode    Boolean  @default(false)
  logRetention       String   @default("90_DAYS")
  updatedAt          DateTime @updatedAt

  @@map("system_settings")
}
```
