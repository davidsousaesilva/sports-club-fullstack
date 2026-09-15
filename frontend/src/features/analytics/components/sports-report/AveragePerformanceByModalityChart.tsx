import { Activity } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
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
import type { AveragePerformanceByModalityItem } from "../../model/sports-report/sports-report.types";

interface AveragePerformanceByModalityChartProps {
  data: AveragePerformanceByModalityItem[];
  isLoading?: boolean;
}

function AveragePerformanceByModalityChart({
  data,
  isLoading = false,
}: AveragePerformanceByModalityChartProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Desempenho médio por modalidade
            </CardTitle>
            <p className="text-sm text-slate-500">
              Distribuição da pontuação de desempenho por modalidade
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existem dados de desempenho por modalidade.
          </div>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ left: 8, right: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 10]}
                />
                <Tooltip formatter={(value) => `${value}/10`} />
                <Bar
                  dataKey="value"
                  name="Desempenho médio"
                  fill="#059669"
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

export { AveragePerformanceByModalityChart };
