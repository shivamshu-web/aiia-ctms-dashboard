import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studyCode, type, severity, description, reportedBy } = body;

    // 1. Find study by code or ID
    let study = await prisma.study.findFirst({
      where: {
        OR: [
          { studyCode: studyCode },
          { id: studyCode },
        ],
      },
    });

    // If study not found, create a placeholder so reporting never fails
    if (!study) {
      study = await prisma.study.create({
        data: {
          studyCode: studyCode || 'AIIA-CT-GEN',
          title: 'AIIA Clinical Evaluation Protocol',
          phase: 'PHASE_III',
          status: 'ONGOING',
        },
      });
    }

    const timestamp = Date.now().toString().slice(-4);
    const reportNumber = `PV-${study.studyCode}-${timestamp}`;

    // 2. Create the Safety Report
    const report = await prisma.safetyReport.create({
      data: {
        reportNumber,
        studyId: study.id,
        type: type || 'ADR',
        severity: severity || 'MILD',
        description: description || 'Adverse event observed during trial.',
        reportedBy: reportedBy || 'Dr. Aanchal Singh',
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error: any) {
    console.error('Safety Report Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Database error occurred while filing report' },
      { status: 500 }
    );
  }
}
