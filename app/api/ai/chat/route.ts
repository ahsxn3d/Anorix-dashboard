import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = [
  'SAAS DASHBOARDS',
  'UI TEMPLATES',
  'FULL-STACK APPS',
  'ANIMATED SITES',
] as const;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history = [], model = 'gemini-3.6-flash', customApiKey } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const apiKey = customApiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'NO_API_KEY',
          reply: '⚠️ **Google Gemini API Key is missing.**\n\nPlease add your `GEMINI_API_KEY` to `.env.local` or enter it in the AI Settings at the top of this panel.\n\nYou can generate a free Gemini API Key in seconds at [Google AI Studio](https://aistudio.google.com/app/apikey).',
        },
        { status: 200 }
      );
    }

    // 1. Fetch Real-time Live PostgreSQL Database Snapshot
    let dbSnapshot = {
      inquiriesTotal: 0,
      inquiriesByStatus: { NEW: 0, IN_REVIEW: 0, ACCEPTED: 0, COMPLETED: 0, ARCHIVED: 0 },
      recentInquiries: [] as Array<Record<string, unknown>>,
      deploymentsTotal: 0,
      deploymentsList: [] as Array<Record<string, unknown>>,
      reviewsTotal: 0,
      reviewsApproved: 0,
      reviewsPending: 0,
      aboutProfile: null as Record<string, unknown> | null,
      siteConfig: null as Record<string, unknown> | null,
    };

    try {
      const [inquiries, deployments, reviews, about, siteConfig] = await Promise.all([
        prisma.contactSubmission.findMany({
          orderBy: { createdAt: 'desc' },
          take: 25,
        }),
        prisma.deploymentProduct.findMany({
          orderBy: { displayOrder: 'asc' },
          take: 30,
        }),
        prisma.reviewItem.findMany({
          orderBy: { createdAt: 'desc' },
          take: 20,
        }),
        prisma.aboutContent.findFirst(),
        prisma.siteConfig.findFirst(),
      ]);

      const statusCounts = { NEW: 0, IN_REVIEW: 0, ACCEPTED: 0, COMPLETED: 0, ARCHIVED: 0 };
      inquiries.forEach((item) => {
        const s = (item.status || 'NEW').toUpperCase() as keyof typeof statusCounts;
        if (statusCounts[s] !== undefined) statusCounts[s]++;
        else statusCounts.NEW++;
      });

      dbSnapshot = {
        inquiriesTotal: inquiries.length,
        inquiriesByStatus: statusCounts,
        recentInquiries: inquiries.map((iq) => ({
          id: iq.id,
          clientName: iq.name,
          email: iq.email,
          company: iq.company,
          projectType: iq.projectType,
          budget: iq.budget,
          timeline: iq.timeline,
          status: iq.status,
          priority: iq.priority,
          notes: iq.notes,
          internalNotes: iq.internalNotes,
          submittedAt: iq.createdAt.toISOString(),
        })),
        deploymentsTotal: deployments.length,
        deploymentsList: deployments.map((d) => ({
          id: d.id,
          title: d.title,
          slug: d.slug,
          category: d.category,
          badge: d.badge,
          status: d.status,
          rating: d.rating,
          usersCount: d.usersCount,
          viewsCount: d.viewsCount,
          techStack: d.techStack,
          isPublished: d.isPublished,
        })),
        reviewsTotal: reviews.length,
        reviewsApproved: reviews.filter((r) => r.isApproved).length,
        reviewsPending: reviews.filter((r) => !r.isApproved).length,
        aboutProfile: about
          ? {
              artistName: about.artistName,
              role: about.role,
              contactEmail: about.contactEmail,
              availabilityStatus: about.availabilityStatus,
              yearsActive: about.yearsActive,
              deploymentsDelivered: about.deploymentsDelivered,
              clientSatisfaction: about.clientSatisfaction,
              techSkills: about.techSkills,
            }
          : null,
        siteConfig: siteConfig
          ? {
              brandName: siteConfig.brandName,
              liveBadgeStatus: siteConfig.liveBadgeStatus,
              pingLatency: siteConfig.pingLatency,
              escrowCoverage: siteConfig.escrowCoverage,
            }
          : null,
      };
    } catch (dbError) {
      console.warn('[AI DB SNAPSHOT WARNING]:', dbError);
    }

    // 2. Comprehensive System Instruction with Live PostgreSQL Telemetry & Autonomous Agent Action Protocols
    const systemInstruction = `You are the ANORIX Cockpit AI Agent & Chief Analytics Officer — the authoritative technical AI intelligence capable of analyzing telemetry AND executing real database actions.

Studio Founder & Superadmin: Muhammad Ahsan Javed (Ahsan) (muhammadahsanjaved09@gmail.com)
Studio Tech Stack: Next.js 16 (App Router / Turbopack), React 19, Tailwind CSS, PostgreSQL (Neon Serverless), Prisma ORM, Three.js / WebGL.

=== LIVE REAL-TIME POSTGRESQL DATABASE SNAPSHOT ===
- Inquiries Pipeline Total: ${dbSnapshot.inquiriesTotal}
  • New Transmissions: ${dbSnapshot.inquiriesByStatus.NEW}
  • In Review / Discovery: ${dbSnapshot.inquiriesByStatus.IN_REVIEW}
  • Accepted / Achieved Deals: ${dbSnapshot.inquiriesByStatus.ACCEPTED}
  • Completed Deployments: ${dbSnapshot.inquiriesByStatus.COMPLETED}
  • Canceled / Archived: ${dbSnapshot.inquiriesByStatus.ARCHIVED}
  • Live Inquiries: ${JSON.stringify(dbSnapshot.recentInquiries, null, 2)}

- Production Deployments Total: ${dbSnapshot.deploymentsTotal}
  • Existing Deployments: ${JSON.stringify(dbSnapshot.deploymentsList, null, 2)}

- Client Reviews: Total ${dbSnapshot.reviewsTotal} (${dbSnapshot.reviewsApproved} approved, ${dbSnapshot.reviewsPending} pending)
- Profile & Skills: ${JSON.stringify(dbSnapshot.aboutProfile, null, 2)}

=== CONVERSATIONAL INTELLIGENCE & INTENT HANDLING GUIDELINES ===
1. CASUAL GREETINGS & CHAT ("hi", "hello", "how are you?", "how's your day?", "what's up?"):
   - Respond naturally, warmly, intelligently, and concisely as an executive AI copilot.
   - Example: "Hello Ahsan! All systems and telemetry are nominal. How can I assist your engineering pipeline or studio workflow today?"
   - DO NOT output big analytics tables or database dumps for casual greetings. Keep greetings smooth and brief (1-3 sentences).

2. SPECIFIC ANALYTICS & PIPELINE QUESTIONS:
   - When the user asks about analytics, leads, new emails, cancellations, archived submissions, or deployments:
   - Provide the exact structured breakdown, counts, and reasons using the real PostgreSQL snapshot above. Answer specifically what they asked.

3. AUTONOMOUS PROJECT / DEPLOYMENT CREATION:
   - When the user asks to create, add, or deploy a project, synthesize the metadata (title, slug, client, year, category ["SAAS DASHBOARDS", "UI TEMPLATES", "FULL-STACK APPS", "ANIMATED SITES"], badge, shortDescription, fullDescription, thumbnailUrl, demoUrl, tags, techStack, features, fpsBenchmark, auditScore, status, isFeatured, isPublished) and attach:
\`\`\`json:create_deployment
{
  "title": "...",
  "slug": "...",
  "client": "...",
  "year": "2026",
  "category": "SAAS DASHBOARDS",
  "badge": "FEATURED",
  "shortDescription": "...",
  "fullDescription": "...",
  "thumbnailUrl": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
  "demoUrl": "https://demo.anorent.studio/slug",
  "tags": ["Next.js 16", "Three.js", "Tailwind"],
  "techStack": ["Next.js 16", "React 19", "PostgreSQL"],
  "features": ["Feature 1", "Feature 2"],
  "fpsBenchmark": 60,
  "auditScore": 100,
  "status": "Production",
  "isFeatured": true,
  "isPublished": true
}
\`\`\`

4. TECHNICAL ARCHITECTURE & CODING:
   - Provide crisp, elite Next.js 16, React 19, Three.js, and PostgreSQL code and advice when requested.

The server will automatically intercept any JSON action blocks, commit records to PostgreSQL, and return confirmation!`;

    // Map conversation history to Gemini contents format
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add previous history
    for (const msg of history.slice(-12)) {
      if (msg.text) {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add the latest user message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const targetModel = model || 'gemini-3.6-flash';
    const fallbackModels: string[] = [
      targetModel,
      'gemini-flash-latest',
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-pro-latest',
    ];
    // Remove duplicates while preserving priority
    const modelsToTry = Array.from(new Set(fallbackModels));

    let data: any = null;
    let successfulModel = targetModel;
    let lastError: string = '';

    for (const modelToAttempt of modelsToTry) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelToAttempt)}:generateContent?key=${encodeURIComponent(apiKey)}`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            systemInstruction: {
              parts: [{ text: systemInstruction }],
            },
            generationConfig: {
              temperature: 0.6,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 3000,
            },
          }),
        });

        const resData = await response.json();

        if (response.ok && !resData.error && resData.candidates?.[0]?.content?.parts?.length) {
          data = resData;
          successfulModel = modelToAttempt;
          break;
        } else {
          lastError = resData.error?.message || `HTTP ${response.status}`;
          console.warn(`[Gemini Model ${modelToAttempt} Warning]:`, lastError);
          // If invalid key, no point in trying other models
          if (lastError.includes('API_KEY_INVALID') || lastError.includes('API key not valid')) {
            break;
          }
        }
      } catch (reqErr) {
        lastError = reqErr instanceof Error ? reqErr.message : 'Network error';
        console.warn(`[Gemini Request Exception on ${modelToAttempt}]:`, lastError);
      }
    }

    if (!data || !data.candidates?.[0]) {
      if (lastError.includes('API_KEY_INVALID') || lastError.includes('API key not valid')) {
        return NextResponse.json({
          reply: `🔑 **Invalid Google AI Studio Gemini API Key.**\n\nYour key was rejected by Google AI Studio. Please verify that you copied the complete key starting with \`AIzaSy...\` from [Google AI Studio](https://aistudio.google.com/app/apikey) into \`.env.local\` as \`GEMINI_API_KEY="AIzaSy..."\` or into the panel key configurator above.`,
          error: lastError,
        });
      }

      return NextResponse.json({
        reply: `⚠️ **Gemini API Notice (${targetModel})**\n\n${lastError || 'Temporary Google AI Studio capacity limit.'}\n\n*Tip: Try clicking another model in the dropdown above or try again in a few seconds.*`,
        error: lastError,
      });
    }

    const candidate = data.candidates?.[0];
    let replyText =
      candidate?.content?.parts?.map((p: { text?: string }) => p.text || '').join('\n') ||
      'No response text generated by model.';

    // 3. Intercept & Execute Autonomous Action Blocks
    let createdDeployment = null;
    const actionMatch = replyText.match(/```json:create_deployment\s*([\s\S]*?)\s*```/i);

    if (actionMatch && actionMatch[1]) {
      try {
        const payload = JSON.parse(actionMatch[1]);
        
        // Ensure slug is unique
        let slug = (payload.slug || payload.title || 'new-deployment')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        
        const existing = await prisma.deploymentProduct.findUnique({ where: { slug } });
        if (existing) {
          slug = `${slug}-${Date.now().toString().slice(-4)}`;
        }

        // Validate category
        const category = VALID_CATEGORIES.includes(payload.category)
          ? payload.category
          : 'SAAS DASHBOARDS';

        const fallbackImg =
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80';

        createdDeployment = await prisma.deploymentProduct.create({
          data: {
            title: payload.title || 'Untitled Project',
            slug,
            client: payload.client || 'ANORENT Studio Client',
            year: payload.year || new Date().getFullYear().toString(),
            category,
            badge: payload.badge || 'FEATURED',
            shortDescription:
              payload.shortDescription || 'High-performance interactive web application.',
            fullDescription: payload.fullDescription || payload.shortDescription || '',
            thumbnailUrl: payload.thumbnailUrl || fallbackImg,
            coverImageUrl: payload.coverImageUrl || payload.thumbnailUrl || fallbackImg,
            previewVideoUrl: payload.previewVideoUrl || null,
            demoUrl: payload.demoUrl || `https://demo.anorent.studio/${slug}`,
            githubUrl: payload.githubUrl || null,
            liveUrl: payload.liveUrl || null,
            rating: typeof payload.rating === 'number' ? payload.rating : 5.0,
            usersCount: payload.usersCount || '10.5k',
            viewsCount: payload.viewsCount || '32.4k',
            tags: Array.isArray(payload.tags) ? payload.tags : ['Next.js 16', 'Tailwind', 'Three.js'],
            techStack: Array.isArray(payload.techStack) ? payload.techStack : ['Next.js 16', 'React 19', 'PostgreSQL'],
            features: Array.isArray(payload.features) ? payload.features : ['Real-time 3D Telemetry', 'High-speed Rendering'],
            fpsBenchmark: typeof payload.fpsBenchmark === 'number' ? payload.fpsBenchmark : 60,
            auditScore: typeof payload.auditScore === 'number' ? payload.auditScore : 100,
            status: payload.status || 'Production',
            isFeatured: payload.isFeatured !== false,
            isPublished: payload.isPublished !== false,
            displayOrder: 0,
          },
        });

        // Strip the raw codeblock from the final text and replace with sleek confirmation badge
        replyText = replyText.replace(/```json:create_deployment[\s\S]*?```/gi, '').trim();
        replyText += `\n\n---\n### 🚀 **DEPLOYMENT AUTO-PROVISIONED IN POSTGRESQL**\n- **Project Title:** \`${createdDeployment.title}\`\n- **Category:** \`${createdDeployment.category}\`\n- **Identifier / Slug:** \`${createdDeployment.slug}\`\n- **Client:** \`${createdDeployment.client}\`\n- **Tags:** \`${createdDeployment.tags.join(', ')}\`\n- **Status:** \`LIVE & PUBLISHED\`\n\n*✅ This project is now live in your database and appears in the Deployments tab and Studio showcase!*`;

        revalidatePath('/deployments');
        revalidatePath('/admin/deployments');
        revalidatePath('/');
      } catch (mutationErr) {
        console.error('[AI DEPLOYMENT MUTATION ERROR]:', mutationErr);
        replyText += `\n\n⚠️ *Notice: Attempted to auto-provision project, but database mutation encountered an error: ${mutationErr instanceof Error ? mutationErr.message : 'Invalid structure'}.*`;
      }
    }

    return NextResponse.json({
      success: true,
      reply: replyText,
      model: targetModel,
      createdDeployment,
      usage: data.usageMetadata,
    });
  } catch (error) {
    console.error('[AI Chat Route Error]:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal AI route error',
        reply: '⚠️ An unexpected error occurred while communicating with Google Gemini. Please try again.',
      },
      { status: 500 }
    );
  }
}
