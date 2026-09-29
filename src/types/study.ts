export interface Study {
  id: string;
  studyCode: string;
  title: string;
  phase: string;
  sitesCount: number;
  enrolledCount: number;
  targetPatients: number;
  status: string;
  ctriNumber?: string | null;
}
