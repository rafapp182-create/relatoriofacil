
export type ActivityType = 'preventiva' | 'corretiva';
export type Shift = 'A' | 'B' | 'C' | 'D';
export type WorkCenter = 'SC108HH' | 'SC118HH' | 'SC103HH' | 'SC105HH' | 'SC117HH';
export type ReportType = 'template' | 'report';

export interface ReportPhoto {
  id: string;
  dataUrl: string;
  timestamp: number;
  caption?: string;
}

export interface Report {
  id: string;
  type: ReportType;
  omDescription: string;
  activityExecuted: string;
  date: string;
  omNumber: string;
  equipment: string;
  local: string;
  activityType: ActivityType;
  startTime: string;
  endTime: string;
  iamoDeviation: boolean;
  iamoDescription?: string;
  isFinished: boolean;
  hasPendencies: boolean;
  pendencyDescription?: string;
  teamShift: Shift;
  workCenter: WorkCenter;
  technicians: string;
  photos: ReportPhoto[];
  createdAt: number;
  updatedAt: number;
}
