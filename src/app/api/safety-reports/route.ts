import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reports = await prisma.safetyReport.findMany({
      include: {
        study: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(reports);
  } catch (error: any) {
    console.error('Error fetching safety reports:', error);
    return NextResponse.json([], { status: 200 });
  }
}
