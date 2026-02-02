import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';

// Helper to verify admin token
async function verifyToken(token: string | null): Promise<boolean> {
  if (!token) return false;

  const prisma = await getPrisma();
  const session = await prisma.adminSession.findUnique({
    where: { token },
  });

  return session !== null && session.expiresAt > new Date();
}

export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!await verifyToken(token || null)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get Prisma client (lazy initialization for serverless)
    const prisma = await getPrisma();

    // Fetch submissions, newest first
    const submissions = await prisma.diagnosticSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
        firstName: true,
        email: true,
        storeUrl: true,
        monthlyRevenueRange: true,
        sessions30d: true,
        orders30d: true,
        conversionRate: true,
        aov: true,
        abandonedCarts30d: true,
        revenueEst: true,
        revenuePerSession: true,
        leakScore: true,
        topLeak1: true,
        topLeak2: true,
        emailSentAt: true,
        ownerNotifiedAt: true,
        ghlSyncedAt: true,
      },
    });

    return NextResponse.json({ submissions });
  } catch (error) {
    console.error('[Admin Submissions] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
