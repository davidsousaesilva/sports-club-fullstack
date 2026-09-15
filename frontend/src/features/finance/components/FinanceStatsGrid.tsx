import {
  CalendarClock,
  CheckCircle2,
  Euro,
  Receipt,
  ShieldAlert,
} from "lucide-react";

import {
  StatCard,
  StatsGrid,
} from "../../../shared/components/data-display/stats-card";

type FinanceSummary = {
  totalFees: number;
  totalDebtItems: number;
  totalDebtAmount: number;
  confirmedPayments: number;
  pendingPayments: number;
};

type FinanceStatsGridProps = {
  summary: FinanceSummary;
  isLoading?: boolean;
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

function FinanceStatsGrid({
  summary,
  isLoading = false,
}: FinanceStatsGridProps) {
  const items = [
    {
      title: "Quotas",
      value: summary.totalFees,
      icon: Receipt,
      iconClassName: "bg-blue-100 text-blue-700",
    },
    {
      title: "Quotas em dívida",
      value: summary.totalDebtItems,
      icon: ShieldAlert,
      iconClassName: "bg-rose-100 text-rose-700",
    },
    {
      title: "Total em dívida",
      value: formatCurrency(summary.totalDebtAmount),
      icon: Euro,
      iconClassName: "bg-amber-100 text-amber-700",
    },
    {
      title: "Confirmados",
      value: summary.confirmedPayments,
      icon: CheckCircle2,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Pendentes",
      value: summary.pendingPayments,
      icon: CalendarClock,
      iconClassName: "bg-violet-100 text-violet-700",
    },
  ];

  return (
    <StatsGrid cols={5}>
      {items.map((item) => (
        <StatCard
          key={item.title}
          label={item.title}
          value={item.value}
          icon={item.icon}
          iconClassName={item.iconClassName}
          isLoading={isLoading}
        />
      ))}
    </StatsGrid>
  );
}

export { FinanceStatsGrid };
