import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const studies = await prisma.study.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const headers = [
      'Study Code',
      'Title',
      'Phase',
      'Sites Count',
      'Enrolled Patients',
      'Target Patients',
      'Status',
      'CTRI Number',
      'Created Date'
    ];

    const rows = studies.map((s) => [
      `"${s.studyCode}"`,
      `"${(s.title || '').replace(/"/g, '""')}"`,
      `"${s.phase}"`,
      s.sitesCount,
      s.enrolledCount,
      s.targetPatients,
      `"${s.status}"`,
      `"${s.ctriNumber || 'N/A'}"`,
      `"${new Date(s.createdAt).toISOString().slice(0, 10)}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="AIIA_Clinical_Trials_Report_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error: any) {
    console.error('Report Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate clinical report' },
      { status: 500 }
    );
  }
}
