import { BarChart3 } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { TeamAttendanceRateItem } from "../../model/sports-report/sports-report.types";

interface TeamAttendanceRateChartProps {
  data: TeamAttendanceRateItem[];
  isLoading?: boolean;
}

function TeamAttendanceRateChart({
  data,
  isLoading = false,
}: TeamAttendanceRateChartProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-sky-100 p-2.5 text-sky-700">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Taxa de assiduidade por equipa
            </CardTitle>
            <p className="text-sm text-slate-500">
              Melhores taxas de assiduidade por equipa
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existem dados de assiduidade por equipa.
          </div>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ left: 8, right: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="label"
                  width={120}
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip formatter={(value) => `${value}%`} />
                <Bar
                  dataKey="rate"
                  name="Taxa de assiduidade"
                  fill="#2563eb"
                  radius={[0, 8, 8, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { TeamAttendanceRateChart };
