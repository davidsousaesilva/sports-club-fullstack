import type {
  FeeStatusItem,
  FeeTypeAnalysisItem,
  FinancialAnalysisItem,
  FinancialAnalysisResponseDto,
  FinancialReportData,
  FinancialReportResponseDto,
  PaymentMethodItem,
  RevenueSourceItem,
} from "./financial-report.types";

const MONTH_ABBREVIATIONS: Record<string, string> = {
  january: "Jan",
  february: "Feb",
  march: "Mar",
  april: "Apr",
  may: "May",
  june: "Jun",
  july: "Jul",
  august: "Aug",
  september: "Sep",
  october: "Oct",
  november: "Nov",
  december: "Dec",
};

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function toMoneyString(value: number | string | null | undefined): string {
  return toNumber(value).toFixed(2);
}

function toPercentNumber(value: number | string | null | undefined): number {
  const parsed = toNumber(value);

  if (parsed <= 1) {
    return Math.round(parsed * 100);
  }

  return Math.round(parsed);
}

function toPercentageString(value: number | string | null | undefined): string {
  return String(toPercentNumber(value));
}

function capitalizeLabel(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatMapLabel(value: string): string {
  const normalizedValue = value.trim().toLowerCase();

  if (MONTH_ABBREVIATIONS[normalizedValue]) {
    return MONTH_ABBREVIATIONS[normalizedValue];
  }

  return value
    .split(/[_\s-]+/g)
    .filter(Boolean)
    .map((part) => {
      const normalizedPart = part.toLowerCase();

      return (
        MONTH_ABBREVIATIONS[normalizedPart] ?? capitalizeLabel(normalizedPart)
      );
    })
    .join(" ");
}

function createId(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function mapFinancialAnalysis(
  items: Record<string, FinancialAnalysisResponseDto> | null | undefined,
): FinancialAnalysisItem[] {
  return Object.entries(items ?? {})
    .slice(0, 12)
    .map(([label, item]) => ({
      id: createId(label),
      label: formatMapLabel(label),
      revenue: toNumber(item.revenue),
      expenses: toNumber(item.expenses),
    }));
}

function mapProfitTrend(
  items: Record<string, number | string> | null | undefined,
): FinancialReportData["profitTrend"] {
  return Object.entries(items ?? {})
    .slice(0, 12)
    .map(([label, value]) => ({
      id: createId(label),
      label: formatMapLabel(label),
      profit: toNumber(value),
    }));
}

function mapFeeStatusState(
  items: Record<string, number | string> | null | undefined,
): FeeStatusItem[] {
  return Object.entries(items ?? {}).map(([label, value]) => ({
    id: createId(label),
    label: formatMapLabel(label),
    value: toNumber(value),
  }));
}

function mapRevenuesBySource(
  items: Record<string, number | string> | null | undefined,
): RevenueSourceItem[] {
  const mappedItems = Object.entries(items ?? {}).map(([label, value]) => ({
    id: createId(label),
    label: formatMapLabel(label),
    value: toNumber(value),
  }));

  const total = mappedItems.reduce((sum, item) => sum + item.value, 0);

  return mappedItems.map((item) => ({
    ...item,
    percentage: total > 0 ? Number(((item.value / total) * 100).toFixed(1)) : 0,
  }));
}

function mapFeeAnalysisByType(
  dto: FinancialReportResponseDto["feeAnalysisByType"],
): FeeTypeAnalysisItem[] {
  return [
    {
      id: "registrations",
      label: "Registrations",
      quantity: dto.numberOfRegistrations,
      average: toNumber(dto.averageRegistrations),
    },
    {
      id: "monthly-fees",
      label: "Monthly fees",
      quantity: dto.numberOfMonthlyFees,
      average: toNumber(dto.averageMonthlyFees),
    },
    {
      id: "competition-fees",
      label: "Competition fees",
      quantity: dto.numberOfCompetitionFees,
      average: toNumber(dto.averageCompetitionFees),
    },
  ];
}

function mapPaymentsByMethod(
  dto: FinancialReportResponseDto["paymentsByMethod"],
): PaymentMethodItem[] {
  return [
    {
      id: "multibanco",
      label: "Multibanco",
      quantity: dto.countMultibanco,
      total: toNumber(dto.totalMultibanco),
      average: toNumber(dto.averageMultibanco),
    },
    {
      id: "cash",
      label: "Cash",
      quantity: dto.countCash,
      total: toNumber(dto.totalCash),
      average: toNumber(dto.averageCash),
    },
  ];
}

function mapFinancialReportResponse(
  dto: FinancialReportResponseDto,
): FinancialReportData {
  return {
    totalReceived: toMoneyString(dto.totalReceived),
    debt: toMoneyString(dto.debt),
    pendingFees: dto.pendingFees ?? 0,
    paymentRate: toPercentageString(dto.paymentRate),
    financialAnalysis: mapFinancialAnalysis(dto.financialAnalysis),
    profitTrend: mapProfitTrend(dto.profitTrend),
    feeStatusState: mapFeeStatusState(dto.feeStatusState),
    revenuesBySource: mapRevenuesBySource(dto.revenuesBySource),
    feeAnalysisByType: mapFeeAnalysisByType(dto.feeAnalysisByType),
    paymentsByMethod: mapPaymentsByMethod(dto.paymentsByMethod),
  };
}

export { mapFinancialReportResponse };