import { Trophy } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { CompetitionAwardsItem } from "../../model/sports-report/sports-report.types";

interface CompetitionAwardsChartProps {
  data: CompetitionAwardsItem[];
  isLoading?: boolean;
}

function CompetitionAwardsChart({
  data,
  isLoading = false,
}: CompetitionAwardsChartProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-yellow-100 p-2.5 text-yellow-700">
            <Trophy className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Prémios em competições
            </CardTitle>
            <p className="text-sm text-slate-500">
              Resultados em medalhas por competição
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[340px] animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-[340px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existem prémios de competições disponíveis.
          </div>
        ) : (
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="gold"
                  name="Ouro"
                  stackId="awards"
                  fill="#fbbf24"
                />
                <Bar
                  dataKey="silver"
                  name="Prata"
                  stackId="awards"
                  fill="#94a3b8"
                />
                <Bar
                  dataKey="bronze"
                  name="Bronze"
                  stackId="awards"
                  fill="#d97706"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { CompetitionAwardsChart };
