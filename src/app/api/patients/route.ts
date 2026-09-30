import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { subjectId, studyCode, siteName, gender, age } = await request.json();

    if (!subjectId || !studyCode) {
      return NextResponse.json({ error: 'Subject ID and Study Code are required' }, { status: 400 });
    }

    const study = await prisma.study.findUnique({
      where: { studyCode },
    });

    if (!study) {
      return NextResponse.json({ error: 'Selected study does not exist' }, { status: 404 });
    }

    // Create patient and increment enrolled count
    const [patient] = await prisma.$transaction([
      prisma.patient.create({
        data: {
          subjectId,
          studyId: study.id,
          siteName: siteName || 'AIIA New Delhi',
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
    console.error(error);
    return NextResponse.json({ error: error.message || 'Failed to add patient' }, { status: 500 });
  }
}