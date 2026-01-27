import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // Get Prisma client (lazy initialization for serverless)
    const prisma = await getPrisma();

    // Check if token exists and is not expired
    const session = await prisma.adminSession.findUnique({
      where: { token },
    });

    if (!session || session.expiresAt < new Date()) {
      // Delete expired session if found
      if (session) {
        await prisma.adminSession.delete({ where: { token } });
      }
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error('[Admin Verify] Error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
