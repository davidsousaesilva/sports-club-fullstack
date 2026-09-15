import {
  Award,
  BarChart3,
  CalendarCheck,
  CalendarClock,
  CalendarX2,
  Dumbbell,
  Medal,
  Star,
  Target,
  Trophy,
} from "lucide-react";

import { Card, CardContent } from "../../../../shared/components/ui/card/Card";
import type { ProfileStatistics } from "../../model/person.types";

type ProfileStatisticsTabProps = {
  statistics: ProfileStatistics | null;
  isLoading: boolean;
};

type MetricCardProps = {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  accentClassName: string;
};

function formatDecimal(value: string): string {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "0.0";
  }

  return numericValue.toFixed(1);
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accentClassName,
}: MetricCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="flex items-start justify-between gap-4 pt-6">
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>

        <div
          className={`rounded-2xl p-3 ${accentClassName}`}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileStatisticsTab({
  statistics,
  isLoading,
}: ProfileStatisticsTabProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Card key={index} className="border-slate-200 shadow-sm">
            <CardContent className="space-y-3 pt-6">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!statistics) {
    return (
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex min-h-[240px] flex-col items-center justify-center gap-3 pt-6 text-center">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
            <BarChart3 className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-950">
              Sem estatísticas disponíveis
            </h2>
            <p className="text-sm text-slate-500">
              Ainda não existem dados estatísticos disponíveis para este perfil.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalParticipations =
    statistics.trainingParticipations +
    statistics.eventParticipations +
    statistics.freeTrainingParticipations;

  const totalEvaluations =
    statistics.totalTrainingEvaluations + statistics.totalEventEvaluations;

  const totalAttendance = statistics.presentCount + statistics.absentCount;

  const attendanceRate =
    totalAttendance > 0
      ? `${((statistics.presentCount / totalAttendance) * 100).toFixed(0)}%`
      : "0%";

  const totalMedals =
    statistics.medals.gold +
    statistics.medals.silver +
    statistics.medals.bronze;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Média de treinos"
          value={formatDecimal(statistics.averageTrainings)}
          subtitle={`${statistics.totalTrainingEvaluations} avaliações de treino`}
          icon={Dumbbell}
          accentClassName="bg-violet-50 text-violet-600"
        />

        <MetricCard
          title="Média de eventos"
          value={formatDecimal(statistics.averageEvents)}
          subtitle={`${statistics.totalEventEvaluations} avaliações de evento`}
          icon={Trophy}
          accentClassName="bg-emerald-50 text-emerald-600"
        />

        <MetricCard
          title="Taxa de presença"
          value={attendanceRate}
          subtitle={`${statistics.presentCount} presenças, ${statistics.absentCount} faltas`}
          icon={CalendarCheck}
          accentClassName="bg-blue-50 text-blue-600"
        />

        <MetricCard
          title="Total de participações"
          value={String(totalParticipations)}
          subtitle="Registos de treino, evento e treino livre"
          icon={Target}
          accentClassName="bg-amber-50 text-amber-600"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <Medal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Resumo de medalhas
                </h2>
                <p className="text-sm text-slate-500">
                  Total de medalhas obtidas por este perfil.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-amber-700">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">Ouro</span>
                </div>
                <p className="text-3xl font-bold text-amber-900">
                  {statistics.medals.gold}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-slate-700">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">Prata</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">
                  {statistics.medals.silver}
                </p>
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
                <div className="mb-3 flex items-center gap-2 text-orange-700">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">Bronze</span>
                </div>
                <p className="text-3xl font-bold text-orange-900">
                  {statistics.medals.bronze}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total de medalhas
                  </p>
                  <p className="text-2xl font-bold text-slate-950">
                    {totalMedals}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                  <Star className="h-5 w-5" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Distribuição de participações
                </h2>
                <p className="text-sm text-slate-500">
                  Distribuição pelos tipos de atividade registados.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-violet-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Participações em treino
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-slate-950">
                    {statistics.trainingParticipations}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Participações em evento
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-slate-950">
                    {statistics.eventParticipations}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Participações em treino livre
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-slate-950">
                    {statistics.freeTrainingParticipations}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Presenças
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-slate-950">
                    {statistics.presentCount}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarX2 className="h-4 w-4 text-rose-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Faltas
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-slate-950">
                    {statistics.absentCount}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">
                      Total de avaliações
                    </span>
                  </div>
                  <span className="text-lg font-semibold text-slate-950">
                    {totalEvaluations}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export { ProfileStatisticsTab };
