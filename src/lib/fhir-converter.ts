import { Study } from '@/types/study';

export function convertToFHIRResearchStudy(study: Study) {
  return {
    resourceType: 'ResearchStudy',
    id: study.id,
    identifier: [
      { system: 'https://ctri.nic.in', value: study.ctriNumber || 'PENDING' },
      { system: 'https://aiia.gov.in/studies', value: study.studyCode },
    ],
    title: study.title,
    status: study.status.toLowerCase(),
    phase: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/research-study-phase',
          code: study.phase,
        },
      ],
    },
    enrollment: [{ display: `${study.enrolledCount}/${study.targetPatients} enrolled` }],
  };
}
