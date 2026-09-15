import type { FinancialReportResponseDto } from "./financial-report.types";

const financialReportMockResponse: FinancialReportResponseDto = {
  totalReceived: "12840.75",
  debt: "2145.30",
  pendingFees: 18,
  paymentRate: "85.40",
  financialAnalysis: {
    october: {
      revenue: "3920.50",
      expenses: "2185.20",
    },
    december: {
      revenue: "3920.50",
      expenses: "2185.20",
    },
    january: {
      revenue: "3920.50",
      expenses: "2185.20",
    },
    february: {
      revenue: "4185.90",
      expenses: "2490.10",
    },
    march: {
      revenue: "4734.35",
      expenses: "2810.55",
    },
  },
  profitTrend: {
    october: "1735.30",
    december: "1695.80",
    january: "1735.30",
    february: "1695.80",
    march: "1923.80",
  },
  feeStatusState: {
    paid: "142",
    pending: "18",
    debt: "9",
    expired: "5",
  },
  revenuesBySource: {
    monthly_fees: "8240.75",
    registrations: "2815.00",
    competitions: "1785.00",
  },
  feeAnalysisByType: {
    numberOfRegistrations: 34,
    averageRegistrations: "82.79",
    numberOfMonthlyFees: 142,
    averageMonthlyFees: "58.03",
    numberOfCompetitionFees: 27,
    averageCompetitionFees: "66.11",
  },
  paymentsByMethod: {
    countMultibanco: 121,
    totalMultibanco: "10180.50",
    averageMultibanco: "84.14",
    countCash: 48,
    totalCash: "2660.25",
    averageCash: "55.42",
  },
};

export { financialReportMockResponse };
