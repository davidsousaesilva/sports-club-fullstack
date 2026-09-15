import type {
  DashboardData,
  DashboardDebtFeeItem,
  DashboardFinancialSnapshotItem,
  DashboardModalityTeamsItem,
  DashboardResponseDto,
  DashboardUpcomingActivityItem,
} from "./dashboard.types";

function toNumber(value: number | string | null | undefined): number {
  const parsed = Number(value);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function capitalizeLabel(value: string): string {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getQuarterMonthLabels(referenceDate: Date = new Date()): string[] {
  return [2, 1, 0].map((offset) => {
    const date = new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth() - offset,
      1,
    );

    const monthLabel = new Intl.DateTimeFormat("pt-PT", { month: "short" })
      .format(date)
      .replace(".", "");

    return capitalizeLabel(monthLabel);
  });
}

function formatMoney(value: number | string | null | undefined): string {
  return toNumber(value).toFixed(2);
}

function mapAttendanceRate(value: number | string | null | undefined): number {
  const rate = toNumber(value);

  // Backend devolve 0.83 para 83%.
  if (rate <= 1) {
    return Math.round(rate * 100);
  }

  // Se algum dia o backend passar a devolver 83, continua correto.
  return Math.round(rate);
}

function mapModalityTeamsPercentage(
  modalityTeamsPercentage: Record<string, number | string> | null | undefined,
): DashboardModalityTeamsItem[] {
  return Object.entries(modalityTeamsPercentage ?? {}).map(
    ([name, percentage]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      percentage: toNumber(percentage),
    }),
  );
}

function mapFinancialSnapshotQuarter(
  items: DashboardResponseDto["financialSnapshotQuarter"] | null | undefined,
): DashboardFinancialSnapshotItem[] {
  const monthLabels = getQuarterMonthLabels();

  return (items ?? []).map((item, index) => ({
    id: `snapshot-${index + 1}`,
    label: monthLabels[index] ?? `M${index + 1}`,
    revenue: toNumber(item.revenue),
    expenses: toNumber(item.expenses),
  }));
}

function mapDebtFees(
  items: DashboardResponseDto["debtFees"] | null | undefined,
): DashboardDebtFeeItem[] {
  return (items ?? []).map((item) => ({
    id: item.id,
    amount: toNumber(item.amount),
    dueDate: item.dueDate,
  }));
}

function mapUpcomingActivities(
  items: DashboardResponseDto["upcomingActivities"] | null | undefined,
): DashboardUpcomingActivityItem[] {
  return (items ?? []).map((item) => ({
    id: item.id,
    title: item.title,
    date: item.date,
  }));
}

function mapDashboardResponse(dto: DashboardResponseDto): DashboardData {
  return {
    totalAthletes: dto.totalAthletes ?? 0,
    totalNewAthletesThisMonth: dto.totalNewAthletesThisMonth ?? 0,
    totalActiveTeams: dto.totalActiveTeams ?? 0,
    attendanceRate: mapAttendanceRate(dto.attendanceRate),
    totalRevenueCurrentMonth: formatMoney(dto.totalRevenueCurrentMonth),
    totalDebtsCurrentMonth: formatMoney(dto.totalDebtsCurrentMonth),
    modalityTeamsPercentage: mapModalityTeamsPercentage(
      dto.modalityTeamsPercentage,
    ),
    financialSnapshotQuarter: mapFinancialSnapshotQuarter(
      dto.financialSnapshotQuarter,
    ),
    debtFees: mapDebtFees(dto.debtFees),
    upcomingActivities: mapUpcomingActivities(dto.upcomingActivities),
  };
}

export { mapDashboardResponse };