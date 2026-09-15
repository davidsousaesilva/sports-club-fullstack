import {
  Activity,
  AlertCircle,
  CalendarDays,
  Euro,
  Trophy,
  Users,
} from "lucide-react";

import { useDashboard } from "../hooks/use-dashboard";
import { DashboardStatsGrid } from "../components/dashboard/DashboardStatsGrid";
import { ModalityTeamsChart } from "../components/dashboard/ModalityTeamsChart";
import { FinancialSnapshotChart } from "../components/dashboard/FinancialSnapshotChart";
import { DebtFeesCard } from "../components/dashboard/DebtFeesCard";
import { UpcomingActivitiesCard } from "../components/dashboard/UpcomingActivitiesCard";

function DashboardPage() {
  const { dashboard, isLoading } = useDashboard();

  const stats = [
    {
      title: "Total de atletas",
      value: dashboard?.totalAthletes ?? 0,
      description:
        dashboard && dashboard.totalNewAthletesThisMonth > 0
          ? `+${dashboard.totalNewAthletesThisMonth} este mês`
          : "Sem novos atletas este mês",
      icon: Users,
      iconClassName: "bg-blue-100 text-blue-700",
    },
    {
      title: "Equipas ativas",
      value: dashboard?.totalActiveTeams ?? 0,
      description: "Equipas atualmente ativas",
      icon: Trophy,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Taxa de presenças",
      value: `${dashboard?.attendanceRate ?? 0}%`,
      description: "Desempenho global de presenças",
      icon: Activity,
      iconClassName: "bg-violet-100 text-violet-700",
    },
    {
      title: "Receita do mês atual",
      value: `€${dashboard?.totalRevenueCurrentMonth ?? "0.00"}`,
      description: `€${dashboard?.totalDebtsCurrentMonth ?? "0.00"} em dívida`,
      icon: Euro,
      iconClassName: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-950">Painel</h1>
          <p className="text-sm text-slate-600">
            Visão geral de atletas, equipas, finanças e próximas atividades.
          </p>
        </div>
      </header>

      <DashboardStatsGrid items={stats} isLoading={isLoading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ModalityTeamsChart
          data={dashboard?.modalityTeamsPercentage ?? []}
          isLoading={isLoading}
        />
        <FinancialSnapshotChart
          data={dashboard?.financialSnapshotQuarter ?? []}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <DebtFeesCard
          items={dashboard?.debtFees ?? []}
          isLoading={isLoading}
          icon={AlertCircle}
        />
        <UpcomingActivitiesCard
          items={dashboard?.upcomingActivities ?? []}
          isLoading={isLoading}
          icon={CalendarDays}
        />
      </div>
    </section>
  );
}

export { DashboardPage };
