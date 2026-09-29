export * from './study';
export * from './patient';
export * from './safety';

export interface MetricStats {
  totalStudies: number;
  activePatients: number;
  safetyReports: number;
  enrolmentProgress: number;
  dataQuality: string;
  upcomingMilestones: number;
}
