import { PieChart as PieChartIcon, Users } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { ModalityDistributionItem } from "../../model/sports-report/sports-report.types";

interface ModalityAthletesDistributionCardProps {
  athletesData: ModalityDistributionItem[];
  teamsData: ModalityDistributionItem[];
  isLoading?: boolean;
}

const COLORS = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#7c3aed",
  "#dc2626",
  "#0891b2",
];

function ModalityAthletesDistributionCard({
  athletesData,
  teamsData,
  isLoading = false,
}: ModalityAthletesDistributionCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 text-amber-700">
            <PieChartIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Distribuição por modalidade
            </CardTitle>
            <p className="text-sm text-slate-500">
              Distribuição de atletas e equipas por modalidade
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-[220px] animate-pulse rounded-xl bg-slate-100" />
            <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
          </div>
        ) : athletesData.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existe distribuição por modalidade disponível.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <Users className="h-4 w-4" />
                  Atletas
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={athletesData}
                        dataKey="percentage"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={80}
                        paddingAngle={3}
                        labelLine={false}
                        isAnimationActive={false}
                      >
                        {athletesData.map((item, index) => (
                          <Cell
                            key={item.id}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <PieChartIcon className="h-4 w-4" />
                  Equipas
                </div>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={teamsData}
                        dataKey="percentage"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={80}
                        paddingAngle={3}
                        labelLine={false}
                        isAnimationActive={false}
                      >
                        {teamsData.map((item, index) => (
                          <Cell
                            key={item.id}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {athletesData.map((item, index) => {
                const matchingTeamsItem = teamsData.find(
                  (teamsItem) => teamsItem.id === item.id,
                );

                return (
                  <div
                    key={item.id}
                    className="rounded-lg bg-slate-50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Atletas: {item.percentage}%</span>
                      <span>
                        Equipas: {matchingTeamsItem?.percentage ?? 0}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export { ModalityAthletesDistributionCard };
