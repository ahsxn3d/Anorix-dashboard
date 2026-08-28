import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth, AUTHORIZED_EMAIL } from '@/auth';

export const dynamic = 'force-dynamic';

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
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deployment });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to fetch deployment' },
      { status: 500 }
    );
  }
}

// PUT /api/deployments/[id] - Update deployment with auth lock
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'ACCESS_DENIED: Unauthorized command execution attempt.' },
        { status: 401 }
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
    const session = await auth();
    if (!session?.user?.email || session.user.email.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'ACCESS_DENIED: Unauthorized command execution attempt.' },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.deploymentProduct.deleteMany({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    return NextResponse.json({
      success: true,
      message: `Deployment '${id}' deleted successfully from database`,
      id,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to delete deployment' },
      { status: 500 }
    );
  }
}
