import { Study } from '@/types/study';

export function exportCDISCSDTM(studies: Study[]) {
  return {
    standard: 'CDISC SDTM v3.3 / ODM-XML',
    institute: 'All India Institute of Ayurveda',
    exportedAt: new Date().toISOString(),
    dataset: studies.map((s) => ({
      STUDYID: s.studyCode,
      DOMAIN: 'TS', // Trial Summary
      TSPARM: 'TITLE',
      TSVAL: s.title,
      STATUS: s.status,
    })),
  };
}
