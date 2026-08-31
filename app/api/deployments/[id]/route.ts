import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { auth, AUTHORIZED_EMAIL } from '@/auth';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS_HEADERS });
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

// GET /api/deployments/[id]
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deployment = await prisma.deploymentProduct.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!deployment) {
      return NextResponse.json(
        { success: false, message: `Deployment '${id}' not found` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json({ success: true, data: deployment }, { headers: CORS_HEADERS });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to fetch deployment' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

// PUT /api/deployments/[id] - Update deployment with auth lock
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: 'ACCESS_DENIED: Unauthorized command execution attempt.' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const deployment = await prisma.deploymentProduct.update({
      where: { id },
      data: {
        title: body.title,
        category: body.category,
        badge: body.badge,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : undefined,
        isPublished: body.isPublished !== undefined ? Boolean(body.isPublished) : undefined,
        shortDescription: body.shortDescription,
        fullDescription: body.fullDescription,
        thumbnailUrl: body.thumbnailUrl,
        coverImageUrl: body.coverImageUrl,
        previewVideoUrl: body.previewVideoUrl,
        demoUrl: body.demoUrl,
        githubUrl: body.githubUrl,
        liveUrl: body.liveUrl,
        rating: body.rating,
        tags: body.tags,
        techStack: body.techStack,
        features: body.features,
        fpsBenchmark: body.fpsBenchmark,
        auditScore: body.auditScore,
        status: body.status,
        displayOrder: body.displayOrder,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Deployment '${id}' updated successfully`,
      data: deployment,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to update deployment' },
      { status: 500 }
    );
  }
}

// DELETE /api/deployments/[id] - Delete deployment with auth lock
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorized = await isAuthorized();
    if (!authorized) {
      return NextResponse.json(
        { success: false, message: 'ACCESS_DENIED: Unauthorized command execution attempt.' },
        { status: 401, headers: CORS_HEADERS }
      );
    }

    const { id } = await params;

    await prisma.deploymentProduct.deleteMany({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Deployment '${id}' deleted successfully from database`,
        id,
      },
      { headers: CORS_HEADERS }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to delete deployment' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
