import { Activity, Download, Target, Trophy, Users } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { useSportsReport } from "../hooks/use-sports-report";
import { SportsReportStatsGrid } from "../components/sports-report/SportsReportStatsGrid";
import { TrainingAttendanceEvolutionChart } from "../components/sports-report/TrainingAttendanceEvolutionChart";
import { MultidimensionalPerformanceChart } from "../components/sports-report/MultidimensionalPerformanceChart";
import { TeamAttendanceRateChart } from "../components/sports-report/TeamAttendanceRateChart";
import { AveragePerformanceByModalityChart } from "../components/sports-report/AveragePerformanceByModalityChart";
import { ModalityAthletesDistributionCard } from "../components/sports-report/ModalityAthletesDistributionCard";
import { CompetitionAwardsChart } from "../components/sports-report/CompetitionAwardsChart";

function SportsReportPage() {
  const { report, isLoading } = useSportsReport();

  const stats = [
    {
      title: "Total de atletas",
      value: report?.totalAthletes ?? 0,
      description: "Atletas registados nas várias modalidades",
      icon: Users,
      iconClassName: "bg-blue-100 text-blue-700",
    },
    {
      title: "Total de treinadores",
      value: report?.totalCoaches ?? 0,
      description: "Treinadores atribuídos a equipas ativas",
      icon: Activity,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Equipas ativas",
      value: report?.totalActiveTeams ?? 0,
      description: "Equipas atualmente ativas",
      icon: Trophy,
      iconClassName: "bg-violet-100 text-violet-700",
    },
    {
      title: "Taxa de presenças",
      value: `${report?.attendanceRate ?? "0.00"}%`,
      description: "Desempenho global de presenças",
      icon: Target,
      iconClassName: "bg-amber-100 text-amber-700",
    },
  ];

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-950">
            Relatório desportivo
          </h1>
          <p className="text-sm text-slate-600">
            Análise da atividade de treino, presenças, performance e resultados
            competitivos.
          </p>
        </div>

        <Button type="button" variant="outline" disabled>
          <Download className="mr-2 h-4 w-4" />
          Exportar PDF
        </Button>
      </header>

      <SportsReportStatsGrid items={stats} isLoading={isLoading} />

      <TrainingAttendanceEvolutionChart
        data={report?.trainingAttendanceEvolution ?? []}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <MultidimensionalPerformanceChart
          data={report?.multidimensionalPerformance ?? []}
          isLoading={isLoading}
        />
        <TeamAttendanceRateChart
          data={report?.teamAttendanceRate ?? []}
          isLoading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <AveragePerformanceByModalityChart
          data={report?.averagePerformanceByModality ?? []}
          isLoading={isLoading}
        />
        <ModalityAthletesDistributionCard
          athletesData={report?.modalityAthletesPercentage ?? []}
          teamsData={report?.modalityTeamsPercentage ?? []}
          isLoading={isLoading}
        />
      </div>

      <CompetitionAwardsChart
        data={report?.competitionAwards ?? []}
        isLoading={isLoading}
      />
    </section>
  );
}

export { SportsReportPage };
