export interface AdverseEventReport {
  id: string;
  reportType: 'ADR' | 'SAE';
  description: string;
  severity: 'MILD' | 'MODERATE' | 'SERIOUS' | 'PENDING';
  reportedDate: string;
  deadlineDate?: string | null;
  studyId: string;
  patientId: string;
}
