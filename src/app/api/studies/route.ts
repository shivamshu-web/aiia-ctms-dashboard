import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const studies = await db.study.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(studies);
  } catch (err) {
    return NextResponse.json([
      { id: '1', studyCode: 'AIIA-CT-001', title: 'Diabetes Care Study', phase: 'PHASE_III', sitesCount: 5, enrolledCount: 312, targetPatients: 400, status: 'ONGOING' },
      { id: '2', studyCode: 'AIIA-CT-002', title: 'Oncology Biomarker Study', phase: 'PHASE_II', sitesCount: 4, enrolledCount: 248, targetPatients: 300, status: 'ONGOING' },
      { id: '3', studyCode: 'AIIA-CT-003', title: 'Cardiovascular Risk Study', phase: 'PHASE_II', sitesCount: 6, enrolledCount: 196, targetPatients: 250, status: 'ON_HOLD' },
    ]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const created = await db.study.create({ data: body });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create study' }, { status: 500 });
  }
}
