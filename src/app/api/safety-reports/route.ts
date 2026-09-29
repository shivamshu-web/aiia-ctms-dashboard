import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const reports = await db.adverseEvent.findMany({
      include: { study: true, patient: true },
      take: 20,
    });
    return NextResponse.json({ reports });
  } catch (err) {
    return NextResponse.json({ reports: [] });
  }
}
