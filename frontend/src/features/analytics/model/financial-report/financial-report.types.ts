export interface FinancialAnalysisResponseDto {
  revenue: string;
  expenses: string;
}

export interface FeeTypeAnalysisResponseDto {
  numberOfRegistrations: number;
  averageRegistrations: string;
  numberOfMonthlyFees: number;
  averageMonthlyFees: string;
  numberOfCompetitionFees: number;
  averageCompetitionFees: string;
}

export interface PaymentMethodAnalysisResponseDto {
  countMultibanco: number;
  totalMultibanco: string;
  averageMultibanco: string;
  countCash: number;
  totalCash: string;
  averageCash: string;
}

export interface FinancialReportResponseDto {
  totalReceived: string;
  debt: string;
  pendingFees: number;
  paymentRate: string;
  financialAnalysis: Record<string, FinancialAnalysisResponseDto>;
  profitTrend: Record<string, string>;
  feeStatusState: Record<string, string>;
  revenuesBySource: Record<string, string>;
  feeAnalysisByType: FeeTypeAnalysisResponseDto;
  paymentsByMethod: PaymentMethodAnalysisResponseDto;
}

export interface FinancialAnalysisItem {
  id: string;
  label: string;
  revenue: number;
  expenses: number;
}

export interface ProfitTrendItem {
  id: string;
  label: string;
  profit: number;
}

export interface FeeStatusItem {
  id: string;
  label: string;
  value: number;
}

export interface RevenueSourceItem {
  id: string;
  label: string;
  value: number;
  percentage: number;
}

export interface FeeTypeAnalysisItem {
  id: string;
  label: string;
  quantity: number;
  average: number;
}

export interface PaymentMethodItem {
  id: string;
  label: string;
  quantity: number;
  total: number;
  average: number;
}

export interface FinancialReportData {
  totalReceived: string;
  debt: string;
  pendingFees: number;
  paymentRate: string;
  financialAnalysis: FinancialAnalysisItem[];
  profitTrend: ProfitTrendItem[];
  feeStatusState: FeeStatusItem[];
  revenuesBySource: RevenueSourceItem[];
  feeAnalysisByType: FeeTypeAnalysisItem[];
  paymentsByMethod: PaymentMethodItem[];
}
