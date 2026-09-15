export interface FinancialSnapshotResponseDto {
  revenue: number | string;
  expenses: number | string;
}

export interface DebtFeeResponseDto {
  id: number;
  amount: number | string;
  dueDate: string;
}

export interface UpcomingActivityResponseDto {
  id: number;
  title: string;
  date: string;
}

export interface DashboardResponseDto {
  totalAthletes: number;
  totalNewAthletesThisMonth: number;
  totalActiveTeams: number;
  attendanceRate: number | string;
  totalRevenueCurrentMonth: number | string;
  totalDebtsCurrentMonth: number | string;
  modalityTeamsPercentage: Record<string, number | string>;
  financialSnapshotQuarter: FinancialSnapshotResponseDto[];
  debtFees: DebtFeeResponseDto[];
  upcomingActivities: UpcomingActivityResponseDto[];
}

export interface DashboardModalityTeamsItem {
  id: string;
  name: string;
  percentage: number;
}

export interface DashboardFinancialSnapshotItem {
  id: string;
  label: string;
  revenue: number;
  expenses: number;
}

export interface DashboardDebtFeeItem {
  id: number;
  amount: number;
  dueDate: string;
}

export interface DashboardUpcomingActivityItem {
  id: number;
  title: string;
  date: string;
}

export interface DashboardData {
  totalAthletes: number;
  totalNewAthletesThisMonth: number;
  totalActiveTeams: number;
  attendanceRate: number;
  totalRevenueCurrentMonth: string;
  totalDebtsCurrentMonth: string;
  modalityTeamsPercentage: DashboardModalityTeamsItem[];
  financialSnapshotQuarter: DashboardFinancialSnapshotItem[];
  debtFees: DashboardDebtFeeItem[];
  upcomingActivities: DashboardUpcomingActivityItem[];
}