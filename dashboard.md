# ANORENT Studio Admin Dashboard Architecture Specification & Data Audit
**Document Title:** `dashboard.md`  
**Role:** Principal Full-Stack Engineer & CMS Architect  
**System Version:** 3.1.0-Production Unified  
**Target Architecture:** Next.js 15 App Router + React 19 + TypeScript + Prisma ORM + Neon PostgreSQL + Edge Middleware Cache  

---

## 1. Dashboard Component State & Input Inventory

This inventory documents all interactive UI state variables, input controls, sanitization constraints, and exact target Prisma database mappings across the ANORENT Admin Dashboard modules with 100% Main Website schema parity.

---

### 1.1 Deployments CRUD Module (`DeploymentsSection.tsx` ↔ `DeploymentProduct`)
The Deployments module manages the showcase portfolio items, benchmark scores, live preview iframes, and technology stacks.

| Field Name | Input Control Type | TypeScript Data Type | Target Prisma Column | Validation Rules & Required Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | System-Generated / Readonly | `string` (CUID/UUID) | `id String @id @default(cuid())` | Unique entity identifier. |
| `title` | Text Input (`<input type="text">`) | `string` | `title String` | Required. Trimmed, 3–100 characters. |
| `slug` | Text Input (`<input type="text">`) | `string` | `slug String @unique` | Required. Regex: `^[a-z0-9-]+$`. Auto-generated from title if empty. |
| `client` | Text Input (`<input type="text">`) | `string` | `client String` | Required. Enterprise or client name (e.g., *Nova Protocol Labs*). |
| `year` | Text Input (`<input type="text">`) | `string` | `year String` | Required. 4-digit format (e.g., `2026`). |
| `category` | Select Dropdown (`<select>`) | `'UI Templates' \| 'Full-Stack Apps' \| 'Animated Sites' \| 'SaaS Dashboards'` | `category String` (or `DeploymentCategoryEnum`) | Required enum string. Exactly matches frontend filters. |
| `status` | Select Dropdown (`<select>`) | `'Production' \| 'Staging' \| 'Archived'` | `status String @default("Production")` | Lifecycle state of deployment. |
| `shortDescription` | Textarea (`<textarea rows={2}>`) | `string` | `shortDescription String` | Required. 10–250 characters summary for card previews. |
| `fullDescription` | Textarea (`<textarea rows={4}>`) | `string?` | `fullDescription String?` | Optional. Markdown or plain text comprehensive case study. |
| `thumbnailUrl` | Text Input + File Uploader | `string` | `thumbnailUrl String` | Required. Valid HTTPS URL or storage CDN path. |
| `coverImageUrl` | Text Input + File Uploader | `string?` | `coverImageUrl String?` | Optional. Banner image for detail modals and header cards. |
| `demoUrl` | Text Input (`<input type="url">`) | `string?` | `demoUrl String?` | Optional. Valid external URL format (`https://...`). |
| `sourceUrl` | Text Input (`<input type="url">`) | `string?` | `sourceUrl String?` | Optional. Repository URL (e.g., GitHub, GitLab). |
| `techStack` | Token Pill Builder (Add/Remove) | `string[]` | `techStack String[]` | Min 1 tag required. Non-empty string items. |
| `metrics` | Metric Pill Builder (Add/Remove) | `string[]` | `metrics String[]` | Quantitative proof points (e.g., `["+340% Throughput", "<18ms TTFB"]`). |
| `fpsBenchmark` | Stepper Number Input (`type="number"`) | `number` | `fpsBenchmark Int @default(60)` | Integer range: `30` to `144`. |
| `auditScore` | Stepper Number Input (`type="number"`) | `number` | `auditScore Int @default(100)` | Integer range: `0` to `100` (Lighthouse score). |
| `isFeatured` | Toggle Switch (`role="switch"`) | `boolean` | `isFeatured Boolean @default(false)` | Flag for homepage spotlight and featured carousel. |
| `displayOrder` | Stepper Number Input (`type="number"`) | `number` | `displayOrder Int @default(0)` | Integer index for manual ordering priority. |
| `isPublished` | Toggle Switch (`role="switch"`) | `boolean` | `isPublished Boolean @default(true)` | Controls public visibility across production feeds. |

---

### 1.2 Inquiries CRM & Kanban Module (`InquiriesSection.tsx` ↔ `ContactSubmission`, `InquiryNote`, `User`)
The Inquiries module manages incoming client briefs, lead triage status, budget classifications, internal notes, and administrative assignments.

| Field Name | Input Control Type | TypeScript Data Type | Target Prisma Column | Validation Rules & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | System-Generated / Readonly | `string` | `id String @id @default(cuid())` | Unique submission identifier. |
| `clientName` | Readonly Display / Modal View | `string` | `clientName String` | Client full name (from public contact form). |
| `email` | Click-to-Email / Input | `string` | `email String` | Valid RFC 5322 email address format. |
| `company` | Readonly Display / Edit Input | `string?` | `company String?` | Optional organization or fund name. |
| `budgetTier` | Dropdown Select Filter | `string` | `budgetTier String` | Budget tier option selected during intake. |
| `projectBrief` | Text Display / Expanded Modal | `string` | `projectBrief String` | Scope requirements, deliverables, and technical specs. |
| `status` | Kanban Drag & Drop / Select Dropdown | `SubmissionStatus` | `status SubmissionStatus @default(UNREAD)` | Enum: `UNREAD`, `IN_REVIEW`, `CONTACTED`, `MILESTONE_ACTIVE`, `CLOSED`, `ARCHIVED`. |
| `internalNotes` | Autosave Textarea (`onBlur`) | `string?` | `internalNotes String?` | Private engineering notes, sprint estimates, NDA state. |
| `assignedAdminId` | User Assignment Dropdown | `string?` | `assignedAdminId String?` | Foreign key referencing `User.id` (Admin/Staff). |
| `notes` | Child Notes Thread (Add Note form) | `InquiryNote[]` | `notes InquiryNote[]` | Relational 1-to-many child timeline records. |

#### Child Relation: `InquiryNote`
* **`id`**: Unique string identifier (`cuid()`).
* **`submissionId`**: Foreign key to `ContactSubmission.id` with `onDelete: Cascade`.
* **`authorId`**: Foreign key to `User.id` (Admin author).
* **`noteText`**: Text content of internal comment.
* **`createdAt`**: DateTime timestamp of creation.

---

### 1.3 Client Reviews Moderation Module (`InquiriesSection.tsx` ↔ `ReviewItem`)
The Reviews Moderation tab manages verified client testimonials, ratings, approval status, and public showcase cards.

| Field Name | Input Control Type | TypeScript Data Type | Target Prisma Column | Validation Rules & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | System-Generated / Readonly | `string` | `id String @id @default(cuid())` | Unique review identifier. |
| `name` | Text Input (`<input type="text">`) | `string` | `name String` | Required. Client full name (e.g., *Marcus Sterling*). |
| `email` | Text Input (`<input type="email">`) | `string` | `email String` | Required. Client email for verification audit. |
| `roleCompany` | Text Input (`<input type="text">`) | `string` | `roleCompany String` | Required. Role & company (e.g., *Managing Partner, Sterling Capital*). |
| `rating` | Star Selector / Number Dropdown | `number` | `rating Int @default(5)` | Integer rating between `1` and `5`. |
| `comment` | Textarea (`<textarea rows={3}>`) | `string` | `comment String` | Required. Min 10, max 600 characters testimonial body. |
| `dateString` | Text Input / Datepicker | `string` | `dateString String` | Humanized date display (e.g., *Aug 14, 2026*). |
| `isVerified` | Verification Toggle / Checkbox | `boolean` | `isVerified Boolean @default(true)` | Indicates cryptographic or escrow-verified client. |
| `isApproved` | Live Toggle Switch (`LIVE`/`HIDDEN`) | `boolean` | `isApproved Boolean @default(false)` | Flag determining live publication on homepage testimonial reel. |

---

### 1.4 Hero Section Content Blueprint (`CmsSection.tsx` ↔ `HeroSectionContent`)
Controls the primary landing page headline typography, character-split animations, particle shader system, and intake notices.

| Field Name | Input Control Type | TypeScript Data Type | Target Prisma Column | Validation Rules & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | System-Generated / Singleton | `string` | `id String @id @default("hero-section-content")` | Fixed singleton key `hero-section-content`. |
| `topBadgeText` | Text Input (`<input type="text">`) | `string` | `topBadgeText String` | Floating neon badge text (e.g., `BESPOKE DIGITAL ENGINEERING`). |
| `headlineLine1` | Text Input (`<input type="text">`) | `string` | `headlineLine1 String` | First kinetic headline line (e.g., `Crafting Architectural`). |
| `headlineLine2` | Text Input (`<input type="text">`) | `string` | `headlineLine2 String` | Second kinetic headline line (e.g., `Web Platforms`). |
| `headlineLine3` | Text Input (`<input type="text">`) | `string` | `headlineLine3 String` | Third kinetic headline line (e.g., `& Immersive Systems`). |
| `bioSubtext` | Textarea (`<textarea rows={3}>`) | `string` | `bioSubtext String @db.Text` | Executive bio narrative paragraph. |
| `highlightWords` | Token Pill Builder | `string[]` | `highlightWords String[] @default([])` | Array of keywords wrapped in glowing gradient spans. |
| `primaryCtaLabel` | Text Input (`<input type="text">`) | `string` | `primaryCtaLabel String` | Label for primary magnetic action button. |
| `primaryCtaRoute` | Text Input (`<input type="text">`) | `string` | `primaryCtaRoute String` | Navigation route (e.g., `/contact`). |
| `secondaryCtaLabel` | Text Input (`<input type="text">`) | `string` | `secondaryCtaLabel String` | Label for secondary action button. |
| `secondaryCtaRoute` | Text Input (`<input type="text">`) | `string` | `secondaryCtaRoute String` | Navigation route (e.g., `/deployments`). |
| `pricingNoticeText` | Text Input (`<input type="text">`) | `string` | `pricingNoticeText String` | Live intake availability notice with emerald dot. |
| `particleModes` | Token Pill Builder | `string[]` | `particleModes String[] @default([])` | Array of selectable background particle shaders. |
| `defaultParticleMode` | Select Dropdown | `string` | `defaultParticleMode String @default("Dark Prismatic")` | Default active shader mode. |
| `baseNodeCount` | Number Input (`type="number"`) | `number` | `baseNodeCount Int @default(100)` | Integer node density count (20–500). |
| `targetFps` | Number Input (`type="number"`) | `number` | `targetFps Int @default(60)` | Target framerate benchmark (30–144). |
| `updatedAt` | Automatic Timestamp | `DateTime` | `updatedAt DateTime @updatedAt` | Auto-updated on every mutation. |

---

### 1.5 Story Stages & Interactive Physics Module (`CmsSection.tsx` ↔ `StoryStageContent`, `ArchitectureNode`, `EscrowPhase`)
Controls the sequential 4-stage narrative scroll storytelling engine, interactive spring physics parameters, split headline titles, spec tags, edge architecture nodes, and escrow sprint phases.

#### 1.5.1 Parent Entity: `StoryStageContent`
| Field Name | Input Control Type | TypeScript Data Type | Target Prisma Column | Validation Rules & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | System-Generated / CUID | `string` | `id String @id @default(cuid())` | Unique stage identifier. |
| `stageIndex` | Stepper / Number Input | `number` | `stageIndex Int @unique` | Unique integer sequence (0, 1, 2, 3). |
| `stageBadge` | Text Input (`<input type="text">`) | `string` | `stageBadge String` | Stage badge eyebrow (e.g., `01 // ARCHITECTURAL MASTERY`). |
| `headlineLine1` | Text Input (`<input type="text">`) | `string` | `headlineLine1 String` | Primary title line (e.g., `High-Velocity Systems`). |
| `headlineLine2` | Text Input (`<input type="text">`) | `string` | `headlineLine2 String` | Secondary title line (e.g., `Blueprint & Architecture`). |
| `description` | Textarea (`<textarea rows={3}>`) | `string` | `description String @db.Text` | Technical narrative explaining architecture & benchmarks. |
| `specTag1Title` | Text Input (`<input type="text">`) | `string?` | `specTag1Title String?` | Technical tag 1 title (e.g., `Next.js 15.1`). |
| `specTag1Sub` | Text Input (`<input type="text">`) | `string?` | `specTag1Sub String?` | Technical tag 1 subtext (e.g., `React 19 Server Components`). |
| `specTag2Title` | Text Input (`<input type="text">`) | `string?` | `specTag2Title String?` | Technical tag 2 title (e.g., `< 18ms`). |
| `specTag2Sub` | Text Input (`<input type="text">`) | `string?` | `specTag2Sub String?` | Technical tag 2 subtext (e.g., `Global Edge TTFB`). |
| `specTag3Title` | Text Input (`<input type="text">`) | `string?` | `specTag3Title String?` | Technical tag 3 title (e.g., `Strict TypeScript`). |
| `specTag3Sub` | Text Input (`<input type="text">`) | `string?` | `specTag3Sub String?` | Technical tag 3 subtext (e.g., `Zero Runtime Errors`). |
| `bulletPoint1` | Text Input (`<input type="text">`) | `string?` | `bulletPoint1 String?` | Feature point 1 (e.g., `Enterprise Connection Pooling`). |
| `bulletPoint2` | Text Input (`<input type="text">`) | `string?` | `bulletPoint2 String?` | Feature point 2 (e.g., `Edge Middleware Route Protection`). |
| `defaultTension` | Range Slider (`100`–`600`) | `number` | `defaultTension Int @default(320)` | Spring physics stiffness tension value. |
| `defaultDamping` | Range Slider (`10`–`60`) | `number` | `defaultDamping Int @default(24)` | Spring physics damping coefficient. |
| `primaryCtaLabel` | Text Input (`<input type="text">`) | `string?` | `primaryCtaLabel String?` | Optional stage primary button label. |
| `primaryCtaRoute` | Text Input (`<input type="text">`) | `string?` | `primaryCtaRoute String?` | Optional stage primary button route. |
| `secondaryCtaLabel` | Text Input (`<input type="text">`) | `string?` | `secondaryCtaLabel String?` | Optional stage secondary button label. |
| `secondaryCtaRoute` | Text Input (`<input type="text">`) | `string?` | `secondaryCtaRoute String?` | Optional stage secondary button route. |

#### 1.5.2 Relational Child: `ArchitectureNode` (1-to-many with `StoryStageContent`)
* **`id`**: Unique node ID (`cuid()`).
* **`stageId`**: Foreign key to `StoryStageContent.id` (`onDelete: Cascade`).
* **`key`**: Unique programmatic node key (e.g., `edge-core`, `iad-primary`).
* **`name`**: Edge region name (e.g., `US-East (IAD)`, `Cloud Run Varnish Edge`).
* **`latency`**: Latency benchmark string (e.g., `6ms`, `12ms`).
* **`summary`**: Subtext description of routing role.
* **`order`**: Integer sorting order.
* **`status`**: String enum (`OPTIMAL`, `DEGRADED`, `MAINTENANCE`).

#### 1.5.3 Relational Child: `EscrowPhase` (1-to-many with `StoryStageContent`)
* **`id`**: Unique phase ID (`cuid()`).
* **`stageId`**: Foreign key to `StoryStageContent.id` (`onDelete: Cascade`).
* **`phaseNumber`**: Step numbering string (e.g., `01`, `02`, `03`, `04`).
* **`title`**: Milestone title (e.g., `Architectural Scope`, `Milestone Alpha`).
* **`description`**: Milestone deliverables and acceptance criteria.
* **`badgeText`**: Milestone tag label (e.g., `Fixed Spec`, `100% IP`).
* **`status`**: String enum (`LOCKED`, `IN_PROGRESS`, `PENDING`, `COMPLETED`).

---

### 1.6 FAQ Section Header & Knowledge Base (`CmsSection.tsx` ↔ `FaqSectionContent` & `FaqItem`)

#### 1.6.1 Parent Singleton: `FaqSectionContent`
| Field Name | Input Control Type | TypeScript Data Type | Target Prisma Column | Validation Rules & Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `id` | System-Generated / Singleton | `string` | `id String @id @default("faq-section-content")` | Fixed singleton key `faq-section-content`. |
| `badgeText` | Text Input (`<input type="text">`) | `string` | `badgeText String` | Eyebrow badge (e.g., `KNOWLEDGE BASE & PROTOCOLS`). |
| `pageTitle` | Text Input (`<input type="text">`) | `string` | `pageTitle String` | Main FAQ heading title. |
| `pageSubtitle` | Textarea (`<textarea rows={2}>`) | `string` | `pageSubtitle String @db.Text` | Subtitle description explaining studio standards. |
| `searchPlaceholder` | Text Input (`<input type="text">`) | `string` | `searchPlaceholder String` | Input placeholder for client search bar. |
| `telemetry1Title` / `Sub` | Text Inputs | `string` | `telemetry1Title String`, `telemetry1Sub String` | Pillar 1 badge (e.g., `< 24h` / `Sprint Triage SLA`). |
| `telemetry2Title` / `Sub` | Text Inputs | `string` | `telemetry2Title String`, `telemetry2Sub String` | Pillar 2 badge (e.g., `100%` / `Escrow Handover`). |
| `telemetry3Title` / `Sub` | Text Inputs | `string` | `telemetry3Title String`, `telemetry3Sub String` | Pillar 3 badge (e.g., `60 FPS` / `Motion Locked`). |
| `telemetry4Title` / `Sub` | Text Inputs | `string` | `telemetry4Title String`, `telemetry4Sub String` | Pillar 4 badge (e.g., `0 Debt` / `Type-Safe Code`). |
| `categories` | Token Pill Builder | `string[]` | `categories String[] @default([])` | Array of filter tabs (e.g., `["All", "Process", "Architecture"]`). |

#### 1.6.2 Q&A Entries: `FaqItem`
* **`id`**: Unique string identifier (`cuid()`).
* **`category`**: Category string matching `categories` array.
* **`question`**: String question title.
* **`answer`**: Textarea detailed plain text or markdown response.
* **`orderIndex`**: Integer sorting order index.
* **`isPublished`**: Boolean publication toggle.

---

### 1.7 Site Shell, Header, Footer & About Sections

#### 1.7.1 Site Header Configuration (`SiteHeaderConfig`)
* **`brandName`**: String (`LUMAORA`).
* **`studioTitle`**: String (`DIGITAL ENGINEERING STUDIO`).
* **`studioSubtitle`**: String (`BESPOKE WEB ARCHITECTURES`).
* **`isOnline`**: Boolean toggle controlling glowing status dot.
* **`headerCtaLabel`**: String (`Initiate Deployment`).
* **`headerCtaRoute`**: String (`/contact`).

#### 1.7.2 Footer Global Content (`FooterContent`)
* **`tagline`**: Textarea string explaining studio mission.
* **`copyrightText`**: Text string (`© 2026 LUMAORA Digital Engineering Studio. All rights reserved.`).
* **`bottomBadgeLeft`**: Monospace badge (`Next.js 15.1 + React 19`).
* **`bottomBadgeRight`**: Monospace badge (`100% Escrow Protected Handover`).

#### 1.7.3 About & Proof Metrics (`AboutPageContent` & `ProofMetricCard`)
* **`artistName`**: String (`Ahsan Javed`).
* **`handle`**: Monospace handle (`@ahsxn3d`).
* **`role`**: Professional title (`Principal Systems Architect & Lead Designer`).
* **`location`**: Studio timezone & location string.
* **`executiveBio`**: Comprehensive biography narrative.
* **`techSkills`**: Array of skill tokens (`React 19`, `Next.js 15`, `Prisma ORM`, `WebGL`, etc.).
* **`proofMetrics`**: Relational `ProofMetricCard[]` (`metricKey`, `value`, `label`, `subtext`, `order`).

#### 1.7.4 Contact Portals (`ContactPageContent` & `ContactChannelCard`)
* **`headline`**, **`subtitle`**: Contact page title & turnaround SLA notice.
* **`directEmail`**: Primary studio direct inquiry email address.
* **`budgetTierOptions`**: Array of selectable budget tier strings.
* **`channels`**: Relational `ContactChannelCard[]` (`channelKey`, `label`, `value`, `linkUrl`, `badge`, `isEnabled`, `order`).

---

## 2. Server Actions & Mutation Payload Contracts

All dashboard mutations are handled via strictly typed Next.js Server Actions with built-in input sanitization, database transactions via Prisma ORM, and automated on-demand cache revalidation via `revalidatePath` and `revalidateTag`.

---

### 2.1 Action Contracts & Invalidation Mapping

```typescript
// Shared Action Response Contract
export interface ActionResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  revalidatedPaths?: string[];
  revalidatedTags?: string[];
  timestamp: string;
}
```

#### 1. `upsertDeployment(data: UpsertDeploymentInput): Promise<ActionResponse<DeploymentProduct>>`
* **Purpose:** Creates or updates a deployment product showcase item.
* **Revalidated Paths:** `['/', '/deployments', '/deployments/[slug]', '/admin/deployments']`
* **Revalidated Tags:** `['deployments-feed', 'featured-showcase']`

#### 2. `updateHeroSection(data: HeroSectionContent): Promise<ActionResponse<HeroSectionContent>>`
* **Purpose:** Updates the main landing page hero headlines, CTA destinations, and particle shader configuration.
* **Revalidated Paths:** `['/']`
* **Revalidated Tags:** `['hero-config']`

#### 3. `updateStoryStages(data: StoryStageContent[]): Promise<ActionResponse<StoryStageContent[]>>`
* **Purpose:** Atomic transaction updating all 4 story stages, technical spec tags, physics parameters, architecture nodes, and escrow sprint phases.
* **Revalidated Paths:** `['/', '/about']`
* **Revalidated Tags:** `['story-stages']`

#### 4. `updateHeaderFooter(header: SiteHeaderConfig, footer: FooterContent): Promise<ActionResponse<{ header: SiteHeaderConfig; footer: FooterContent }>>`
* **Purpose:** Updates site-wide global branding, titles, navigation items, status pulse, and footer badges.
* **Revalidated Paths:** `['/', '/deployments', '/about', '/faq', '/contact']`

#### 5. `updateAboutSection(data: AboutPageContent): Promise<ActionResponse<AboutPageContent>>`
* **Purpose:** Updates studio executive biography, tech skills array, and 4 quantitative proof metrics.
* **Revalidated Paths:** `['/about', '/']`

#### 6. `updateContactPortals(data: ContactPageContent): Promise<ActionResponse<ContactPageContent>>`
* **Purpose:** Updates contact channels, direct email ingress, and budget tier options.
* **Revalidated Paths:** `['/contact', '/']`

#### 7. `updateFaqSectionContent(data: FaqSectionContent): Promise<ActionResponse<FaqSectionContent>>`
* **Purpose:** Updates FAQ page header title, subtitle, search placeholder, and 4 live telemetry pillar stat badges.
* **Revalidated Paths:** `['/faq', '/contact', '/']`

#### 8. `upsertFaqItem(data: FaqItem): Promise<ActionResponse<FaqItem>>`
* **Purpose:** Creates or edits an individual FAQ question/answer record.
* **Revalidated Paths:** `['/faq', '/']`

#### 9. `deleteFaqItem(id: string): Promise<ActionResponse<{ id: string }>>`
* **Purpose:** Removes an FAQ question/answer record.
* **Revalidated Paths:** `['/faq', '/']`

#### 10. `updateSubmissionStatus(id: string, status: SubmissionStatus, internalNotes?: string): Promise<ActionResponse<ContactSubmission>>`
* **Purpose:** Transitions Kanban column state and updates internal engineering notes.
* **Revalidated Paths:** `['/admin/inquiries']`

#### 11. `addInquiryNote(submissionId: string, noteText: string, authorId: string): Promise<ActionResponse<InquiryNote>>`
* **Purpose:** Appends internal staff comment to inquiry timeline thread.
* **Revalidated Paths:** `['/admin/inquiries']`

#### 12. `toggleReviewApproval(id: string, isApproved: boolean): Promise<ActionResponse<ReviewItem>>`
* **Purpose:** Moderates client testimonial publication state.
* **Revalidated Paths:** `['/', '/about', '/admin/inquiries']`

---

## 3. Complete Unified Prisma Database Schema (`schema.prisma`)

This schema represents the 100% complete, verified production database definition for the ANORENT Studio ecosystem.

```prisma
// =========================================================================
// ANORENT STUDIO DATABASE SCHEMA (PRISMA ORM)
// Database Engine: PostgreSQL (Neon Serverless / Cloud SQL / Supabase)
// =========================================================================

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------------------
// ENUMS
// -------------------------------------------------------------------------

enum UserRole {
  SUPERADMIN
  ADMIN
  STAFF
}

enum DeploymentCategory {
  UI_TEMPLATES     @map("UI Templates")
  FULL_STACK_APPS  @map("Full-Stack Apps")
  ANIMATED_SITES   @map("Animated Sites")
  SAAS_DASHBOARDS  @map("SaaS Dashboards")
}

enum DeploymentStatus {
  Production
  Staging
  Archived
}

enum SubmissionStatus {
  UNREAD
  IN_REVIEW
  CONTACTED
  MILESTONE_ACTIVE
  CLOSED
  ARCHIVED
}

enum NodeStatus {
  OPTIMAL
  DEGRADED
  MAINTENANCE
}

enum EscrowStatus {
  LOCKED
  IN_PROGRESS
  PENDING
  COMPLETED
}

// -------------------------------------------------------------------------
// AUTHENTICATION & USER MANAGEMENT
// -------------------------------------------------------------------------

model User {
  id            String          @id @default(cuid())
  name          String?
  email         String          @unique
  emailVerified DateTime?
  image         String?
  passwordHash  String?
  role          UserRole        @default(ADMIN)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  // Relational Links
  assignedSubmissions ContactSubmission[]
  inquiryNotes        InquiryNote[]
  activityLogs        AdminActivityLog[]

  @@index([email])
}

model AdminActivityLog {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  action    String
  entity    String
  entityId  String?
  details   Json?
  createdAt DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}

// -------------------------------------------------------------------------
// SHOWCASE & DEPLOYMENT PRODUCTS
// -------------------------------------------------------------------------

model DeploymentProduct {
  id               String             @id @default(cuid())
  title            String
  slug             String             @unique
  client           String
  year             String             @default("2026")
  category         DeploymentCategory @default(FULL_STACK_APPS)
  status           DeploymentStatus   @default(Production)
  shortDescription String
  fullDescription  String?            @db.Text
  thumbnailUrl     String
  coverImageUrl    String?
  demoUrl          String?
  sourceUrl        String?
  techStack        String[]           @default([])
  metrics          String[]           @default([])
  fpsBenchmark     Int                @default(60)
  auditScore       Int                @default(100)
  isFeatured       Boolean            @default(false)
  displayOrder     Int                @default(0)
  isPublished      Boolean            @default(true)
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  @@index([category])
  @@index([isFeatured])
  @@index([isPublished])
  @@index([displayOrder])
}

// -------------------------------------------------------------------------
// INQUIRIES, CRM & KANBAN
// -------------------------------------------------------------------------

model ContactSubmission {
  id              String           @id @default(cuid())
  clientName      String
  email           String
  company         String?
  budgetTier      String
  projectBrief    String           @db.Text
  status          SubmissionStatus @default(UNREAD)
  internalNotes   String?          @db.Text
  assignedAdminId String?
  assignedAdmin   User?            @relation(fields: [assignedAdminId], references: [id], onDelete: SetNull)
  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  // Relational Child Notes
  notes InquiryNote[]

  @@index([status])
  @@index([createdAt])
  @@index([assignedAdminId])
}

model InquiryNote {
  id           String            @id @default(cuid())
  submissionId String
  submission   ContactSubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  authorId     String
  author       User              @relation(fields: [authorId], references: [id], onDelete: Cascade)
  noteText     String            @db.Text
  createdAt    DateTime          @default(now())

  @@index([submissionId])
  @@index([authorId])
}

// -------------------------------------------------------------------------
// REVIEWS & TESTIMONIALS MODERATION
// -------------------------------------------------------------------------

model ReviewItem {
  id          String   @id @default(cuid())
  name        String
  email       String
  roleCompany String
  rating      Int      @default(5)
  comment     String   @db.Text
  dateString  String
  isVerified  Boolean  @default(true)
  isApproved  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isApproved])
  @@index([rating])
}

// -------------------------------------------------------------------------
// HERO SECTION CONTENT
// -------------------------------------------------------------------------

model HeroSectionContent {
  id                  String   @id @default("hero-section-content")
  topBadgeText        String
  headlineLine1       String
  headlineLine2       String
  headlineLine3       String
  bioSubtext          String   @db.Text
  highlightWords      String[] @default([])
  primaryCtaLabel     String
  primaryCtaRoute     String
  secondaryCtaLabel   String
  secondaryCtaRoute   String
  pricingNoticeText   String
  particleModes       String[] @default([])
  defaultParticleMode String   @default("Dark Prismatic")
  baseNodeCount       Int      @default(100)
  targetFps           Int      @default(60)
  updatedAt           DateTime @updatedAt
}

// -------------------------------------------------------------------------
// STORY STAGES CMS & HARDWARE PHYSICS
// -------------------------------------------------------------------------

model StoryStageContent {
  id                String   @id @default(cuid())
  stageIndex        Int      @unique
  stageBadge        String
  headlineLine1     String
  headlineLine2     String
  description       String   @db.Text
  specTag1Title     String?
  specTag1Sub       String?
  specTag2Title     String?
  specTag2Sub       String?
  specTag3Title     String?
  specTag3Sub       String?
  bulletPoint1      String?
  bulletPoint2      String?
  defaultTension    Int      @default(320)
  defaultDamping    Int      @default(24)
  primaryCtaLabel   String?
  primaryCtaRoute   String?
  secondaryCtaLabel String?
  secondaryCtaRoute String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Relational Children
  architectureNodes ArchitectureNode[]
  escrowPhases      EscrowPhase[]

  @@index([stageIndex])
}

model ArchitectureNode {
  id        String            @id @default(cuid())
  stageId   String
  stage     StoryStageContent @relation(fields: [stageId], references: [id], onDelete: Cascade)
  key       String
  name      String
  latency   String
  summary   String
  order     Int               @default(1)
  status    NodeStatus        @default(OPTIMAL)
  createdAt DateTime          @default(now())

  @@index([stageId])
  @@index([order])
}

model EscrowPhase {
  id          String            @id @default(cuid())
  stageId     String
  stage       StoryStageContent @relation(fields: [stageId], references: [id], onDelete: Cascade)
  phaseNumber String
  title       String
  description String
  badgeText   String
  status      EscrowStatus      @default(PENDING)
  createdAt   DateTime          @default(now())

  @@index([stageId])
}

// -------------------------------------------------------------------------
// SITE SHELL, BRANDING & CMS SINGLETONS
// -------------------------------------------------------------------------

model SiteHeaderConfig {
  id             String   @id @default("singleton")
  brandName      String   @default("LUMAORA")
  studioTitle    String   @default("DIGITAL ENGINEERING STUDIO")
  studioSubtitle String   @default("BESPOKE WEB ARCHITECTURES")
  isOnline       Boolean  @default(true)
  headerCtaLabel String   @default("Initiate Deployment")
  headerCtaRoute String   @default("/contact")
  updatedAt      DateTime @updatedAt
}

model FooterContent {
  id               String   @id @default("singleton")
  tagline          String   @db.Text
  copyrightText    String
  bottomBadgeLeft  String
  bottomBadgeRight String
  socialXUrl       String?
  socialGithubUrl  String?
  socialDribbbleUrl String?
  socialFiverrUrl  String?
  updatedAt        DateTime @updatedAt
}

model AboutPageContent {
  id           String            @id @default("singleton")
  artistName   String
  handle       String
  role         String
  location     String
  executiveBio String            @db.Text
  techSkills   String[]          @default([])
  directEmail  String
  timeZone     String
  availability String
  updatedAt    DateTime          @updatedAt

  proofMetrics ProofMetricCard[]
}

model ProofMetricCard {
  id          String           @id @default(cuid())
  aboutPageId String           @default("singleton")
  aboutPage   AboutPageContent @relation(fields: [aboutPageId], references: [id], onDelete: Cascade)
  metricKey   String
  value       String
  label       String
  subtext     String
  order       Int              @default(0)

  @@index([aboutPageId])
  @@index([order])
}

model ContactPageContent {
  id                String               @id @default("singleton")
  headline          String
  subtitle          String
  directEmail       String
  budgetTierOptions String[]             @default([])
  updatedAt         DateTime             @updatedAt

  channels          ContactChannelCard[]
}

model ContactChannelCard {
  id            String             @id @default(cuid())
  contactPageId String             @default("singleton")
  contactPage   ContactPageContent @relation(fields: [contactPageId], references: [id], onDelete: Cascade)
  channelKey    String
  label         String
  value         String
  linkUrl       String
  badge         String?
  isEnabled     Boolean            @default(true)
  order         Int                @default(0)

  @@index([contactPageId])
  @@index([order])
}

// -------------------------------------------------------------------------
// FAQ SECTION & LIVE TELEMETRY KNOWLEDGE BASE
// -------------------------------------------------------------------------

model FaqSectionContent {
  id                String   @id @default("faq-section-content")
  badgeText         String
  pageTitle         String
  pageSubtitle      String   @db.Text
  searchPlaceholder String
  telemetry1Title   String
  telemetry1Sub     String
  telemetry2Title   String
  telemetry2Sub     String
  telemetry3Title   String
  telemetry3Sub     String
  telemetry4Title   String
  telemetry4Sub     String
  categories        String[] @default([])
  updatedAt         DateTime @updatedAt
}

model FaqItem {
  id          String   @id @default(cuid())
  category    String   @default("General")
  question    String
  answer      String   @db.Text
  orderIndex  Int      @default(0)
  isPublished Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([category])
  @@index([isPublished])
  @@index([orderIndex])
}

// -------------------------------------------------------------------------
// SYSTEM TELEMETRY CONFIGURATION
// -------------------------------------------------------------------------

model SystemTelemetryConfig {
  id                      String   @id @default("singleton")
  maintenanceMode         Boolean  @default(false)
  enableLivePreview       Boolean  @default(true)
  telemetryPollIntervalMs Int      @default(5000)
  edgeCacheTtlSeconds     Int      @default(60)
  primaryCdnRegion        String   @default("asia-southeast1")
  updatedAt               DateTime @updatedAt
}
```
