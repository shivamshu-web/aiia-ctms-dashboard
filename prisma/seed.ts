import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Neon database with AIIA CTMS sample records...');

  await prisma.adverseEvent.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.study.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: 'Dr. Meera Sharma',
      email: 'meera.sharma@aiia.gov.in',
      role: 'PRINCIPAL_INVESTIGATOR' as any,
    },
  });

  const s1 = await prisma.study.create({
    data: {
      studyCode: 'AIIA-CT-001',
      title: 'Diabetes Care Study',
      phase: 'PHASE_III' as any,
      sitesCount: 5,
      targetPatients: 400,
      enrolledCount: 312,
      status: 'ONGOING' as any,
      ctriNumber: 'CTRI/2026/09/001421',
      investigatorId: user.id,
    },
  });

  const s2 = await prisma.study.create({
    data: {
      studyCode: 'AIIA-CT-002',
      title: 'Oncology Biomarker Study',
      phase: 'PHASE_II' as any,
      sitesCount: 4,
      targetPatients: 300,
      enrolledCount: 248,
      status: 'ONGOING' as any,
      ctriNumber: 'CTRI/2026/08/002341',
      investigatorId: user.id,
    },
  });

  const s3 = await prisma.study.create({
    data: {
      studyCode: 'AIIA-CT-003',
      title: 'Cardiovascular Risk Study',
      phase: 'PHASE_II' as any,
      sitesCount: 6,
      targetPatients: 250,
      enrolledCount: 196,
      status: 'ON_HOLD' as any,
      ctriNumber: 'CTRI/2026/07/003891',
      investigatorId: user.id,
    },
  });

  const p1 = await prisma.patient.create({
    data: {
      patientCode: 'PT-1001',
      gender: 'Female',
      age: 48,
      studyId: s1.id,
    },
  });

  await prisma.adverseEvent.create({
    data: {
      reportType: 'ADR',
      description: 'Mild gastric discomfort observed after dosage',
      severity: 'MILD' as any,
      studyId: s1.id,
      patientId: p1.id,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });