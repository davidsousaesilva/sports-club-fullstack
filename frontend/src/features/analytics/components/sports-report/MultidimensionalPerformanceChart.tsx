import { Radar as RadarIcon } from "lucide-react";
import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { MultidimensionalPerformanceItem } from "../../model/sports-report/sports-report.types";

interface MultidimensionalPerformanceChartProps {
  data: MultidimensionalPerformanceItem[];
  isLoading?: boolean;
}

function MultidimensionalPerformanceChart({
  data,
  isLoading = false,
}: MultidimensionalPerformanceChartProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-2.5 text-violet-700">
            <RadarIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Desempenho multidimensional
            </CardTitle>
            <p className="text-sm text-slate-500">
              Assiduidade, desempenho e competitividade por modalidade
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existe desempenho multidimensional disponível.
          </div>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="76%" data={data}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="label" stroke="#64748b" />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  stroke="#94a3b8"
                />
                <Radar
                  name="Assiduidade"
                  dataKey="attendance"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.18}
                />
                <Radar
                  name="Desempenho"
                  dataKey="performance"
                  stroke="#059669"
                  fill="#059669"
                  fillOpacity={0.18}
                />
                <Radar
                  name="Competitividade"
                  dataKey="competitiveness"
                  stroke="#d97706"
                  fill="#d97706"
                  fillOpacity={0.18}
                />
                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { MultidimensionalPerformanceChart };
