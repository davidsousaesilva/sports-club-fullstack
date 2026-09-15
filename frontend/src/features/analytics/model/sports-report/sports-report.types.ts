export interface TeamTrainingEvolutionResponseDto {
  totalTrainings: number;
  attendanceRate: string;
}

export interface MultidimensionalPerformanceResponseDto {
  attendance: number;
  performance: number;
  competitiveness: number;
}

export interface CompetitionAwardsResponseDto {
  gold: number;
  silver: number;
  bronze: number;
}

export interface SportReportResponseDto {
  totalAthletes: number;
  totalCoaches: number;
  totalActiveTeams: number;
  attendanceRate: string;
  trainingAttendanceEvolution: Record<string, TeamTrainingEvolutionResponseDto>;
  multidimensionalPerformance: Record<
    string,
    MultidimensionalPerformanceResponseDto
  >;
  teamAttendanceRate: Record<string, string>;
  averagePerformanceByModality: Record<string, string>;
  modalityTeamsPercentage: Record<string, string>;
  modalityAthletesPercentage: Record<string, string>;
  competitionAwards: Record<string, CompetitionAwardsResponseDto>;
}

export interface TrainingAttendanceEvolutionItem {
  id: string;
  label: string;
  totalTrainings: number;
  attendanceRate: number;
}

export interface MultidimensionalPerformanceItem {
  id: string;
  label: string;
  attendance: number;
  performance: number;
  competitiveness: number;
}

export interface TeamAttendanceRateItem {
  id: string;
  label: string;
  rate: number;
}

export interface AveragePerformanceByModalityItem {
  id: string;
  label: string;
  value: number;
}

export interface ModalityDistributionItem {
  id: string;
  label: string;
  percentage: number;
}

export interface CompetitionAwardsItem {
  id: string;
  label: string;
  gold: number;
  silver: number;
  bronze: number;
}

export interface SportReportData {
  totalAthletes: number;
  totalCoaches: number;
  totalActiveTeams: number;
  attendanceRate: string;
  trainingAttendanceEvolution: TrainingAttendanceEvolutionItem[];
  multidimensionalPerformance: MultidimensionalPerformanceItem[];
  teamAttendanceRate: TeamAttendanceRateItem[];
  averagePerformanceByModality: AveragePerformanceByModalityItem[];
  modalityTeamsPercentage: ModalityDistributionItem[];
  modalityAthletesPercentage: ModalityDistributionItem[];
  competitionAwards: CompetitionAwardsItem[];
}
