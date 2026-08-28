import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth, AUTHORIZED_EMAIL } from '@/auth';

export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
}

// GET /api/deployments - Fetch real deployments from PostgreSQL
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (category && category !== 'ALL') {
      where.category = { equals: category, mode: 'insensitive' };
    }

    if (featured === 'true') {
      where.isFeatured = true;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const deployments = await prisma.deploymentProduct.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    return NextResponse.json(
      {
        success: true,
        total: deployments.length,
        data: deployments,
        timestamp: new Date().toISOString(),
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: unknown) {
    console.error('[API DEPLOYMENTS GET ERROR]:', error);
    return NextResponse.json(
      {
        success: true,
        total: 0,
        data: [],
        message: 'No deployments found or database initializing.',
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers: CORS_HEADERS }
    );
  }
}

// Helper for session authorization in API route
async function isAuthorized(): Promise<boolean> {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }

  try {
    const session = await auth();
    if (session?.user?.email && session.user.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
      return true;
    }
  } catch {
    // Check cookie
  }

  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('anorent_session_user');
    if (sessionCookie?.value) {
      const decoded = decodeURIComponent(sessionCookie.value);
      const parsed = JSON.parse(decoded);
      if (parsed?.email && parsed.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
        return true;
      }
    }
  } catch {
    // Unauthenticated
  }

  return false;
}

// POST /api/deployments - Create or upsert deployment with strict server session guard
export async function POST(request: NextRequest) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: 'ACCESS_DENIED: Unauthorized command execution attempt.' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const body = await request.json();

    if (!body || !body.title) {
      return NextResponse.json(
        { success: false, message: 'Deployment title is required' },
        { status: 400 }
      );
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const demoUrl = body.demoUrl || body.liveUrl || 'https://anorent.com';

    const deployment = await prisma.deploymentProduct.upsert({
      where: { slug },
      update: {
        title: body.title,
        category: body.category || 'SAAS DASHBOARDS',
        badge: body.badge || (body.isFeatured ? 'FEATURED' : null),
        isFeatured: Boolean(body.isFeatured),
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        shortDescription: body.shortDescription || '',
        fullDescription: body.fullDescription || body.shortDescription || '',
        thumbnailUrl: body.thumbnailUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        coverImageUrl: body.coverImageUrl || body.thumbnailUrl,
        previewVideoUrl: body.previewVideoUrl || null,
        demoUrl,
        githubUrl: body.githubUrl || null,
        liveUrl: body.liveUrl || demoUrl,
        rating: typeof body.rating === 'number' ? body.rating : 5.0,
        usersCount: body.usersCount || '0',
        viewsCount: body.viewsCount || '0',
        tags: Array.isArray(body.tags) ? body.tags : [],
        techStack: Array.isArray(body.techStack) ? body.techStack : [],
        features: Array.isArray(body.features) ? body.features : [],
        fpsBenchmark: typeof body.fpsBenchmark === 'number' ? body.fpsBenchmark : 60,
        auditScore: typeof body.auditScore === 'number' ? body.auditScore : 100,
        status: body.status || 'Production',
        displayOrder: typeof body.displayOrder === 'number' ? body.displayOrder : 0,
      },
      create: {
        slug,
        title: body.title,
        category: body.category || 'SAAS DASHBOARDS',
        badge: body.badge || (body.isFeatured ? 'FEATURED' : null),
        isFeatured: Boolean(body.isFeatured),
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : true,
        shortDescription: body.shortDescription || '',
        fullDescription: body.fullDescription || body.shortDescription || '',
        thumbnailUrl: body.thumbnailUrl || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
        coverImageUrl: body.coverImageUrl || body.thumbnailUrl,
        previewVideoUrl: body.previewVideoUrl || null,
        demoUrl,
        githubUrl: body.githubUrl || null,
        liveUrl: body.liveUrl || demoUrl,
        rating: typeof body.rating === 'number' ? body.rating : 5.0,
        usersCount: body.usersCount || '0',
        viewsCount: body.viewsCount || '0',
        tags: Array.isArray(body.tags) ? body.tags : [],
        techStack: Array.isArray(body.techStack) ? body.techStack : [],
        features: Array.isArray(body.features) ? body.features : [],
        fpsBenchmark: typeof body.fpsBenchmark === 'number' ? body.fpsBenchmark : 60,
        auditScore: typeof body.auditScore === 'number' ? body.auditScore : 100,
        status: body.status || 'Production',
        displayOrder: typeof body.displayOrder === 'number' ? body.displayOrder : 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Deployment '${deployment.title}' synchronized to database`,
        data: deployment,
        timestamp: new Date().toISOString(),
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: unknown) {
    console.error('[API DEPLOYMENTS POST ERROR]:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Database error' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
