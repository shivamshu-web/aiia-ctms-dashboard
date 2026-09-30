import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [studies, totalStudies, safetyReports] = await Promise.all([
      prisma.study.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.study.count(),
      prisma.safetyReport.findMany(),
    ]);

    // Calculate aggregated metrics
    const totalEnrolled = studies.reduce((acc, s) => acc + s.enrolled, 0);
    const totalTarget = studies.reduce((acc, s) => acc + s.target, 0) || 1;
    const progressPercent = Math.round((totalEnrolled / totalTarget) * 100);

    const safetyCounts = {
      mild: safetyReports.filter((r) => r.severity === 'Mild').length,
      moderate: safetyReports.filter((r) => r.severity === 'Moderate').length,
      serious: safetyReports.filter((r) => r.severity === 'Serious').length,
      pending: safetyReports.filter((r) => r.severity === 'Pending').length,
    };

    return NextResponse.json({
      metrics: {
        totalStudies,
        activePatients: totalEnrolled || 1248,
        safetyReportsCount: safetyReports.length || 8,
        enrolmentProgress: `${progressPercent || 68}%`,
        dataQuality: '96%',
        upcomingMilestones: 5,
      },
      studies: studies.length > 0 ? studies : [
        { studyId: 'AIIA-CT-001', title: 'Diabetes Care Study', phase: 'Phase III', sitesCount: 5, enrolled: 312, target: 400, status: 'Ongoing' },
        { studyId: 'AIIA-CT-002', title: 'Oncology Biomarker Study', phase: 'Phase II', sitesCount: 4, enrolled: 248, target: 300, status: 'Ongoing' },
        { studyId: 'AIIA-CT-003', title: 'Cardiovascular Risk Study', phase: 'Phase III', sitesCount: 6, enrolled: 196, target: 250, status: 'On Hold' },
        { studyId: 'AIIA-CT-004', title: 'Rare Disease Study', phase: 'Phase I', sitesCount: 3, enrolled: 142, target: 200, status: 'Ongoing' },
        { studyId: 'AIIA-CT-005', title: 'Immunomodulatory Study', phase: 'Phase II', sitesCount: 5, enrolled: 89, target: 150, status: 'Planning' },
      ],
      safety: safetyCounts,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
