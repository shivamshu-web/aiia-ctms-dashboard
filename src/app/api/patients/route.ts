import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { subjectId, studyCode, siteName, gender, age } = await request.json();

    if (!subjectId || !studyCode) {
      return NextResponse.json(
        { error: 'Subject ID and Study Code are required' },
        { status: 400 }
      );
    }

    // Find study by studyCode or create/fallback if missing
    let study = await prisma.study.findFirst({
      where: {
        OR: [
          { studyCode: studyCode },
          { id: studyCode }
        ]
      },
    });

    if (!study) {
      // Auto-fallback: create study record if not yet initialized in db
      study = await prisma.study.create({
        data: {
          studyCode: studyCode,
          title: `${studyCode} Evaluation Protocol`,
          phase: 'PHASE_III',
          sitesCount: 4,
          targetPatients: 300,
          enrolledCount: 0,
          status: 'ONGOING',
        }
      });
    }

    // Insert patient & increment enrolledCount
    const [patient] = await prisma.$transaction([
      prisma.patient.create({
        data: {
          subjectId,
          studyId: study.id,
          siteName: siteName || 'AIIA New Delhi Site',
          gender: gender || 'Male',
          age: Number(age) || 30,
        },
      }),
      prisma.study.update({
        where: { id: study.id },
        data: { enrolledCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(patient, { status: 201 });
  } catch (error: any) {
    console.error('Error creating patient:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to enroll patient' },
      { status: 500 }
    );
  }
}