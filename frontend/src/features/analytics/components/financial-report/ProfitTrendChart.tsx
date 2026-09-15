import { LineChart as LineChartIcon } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
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
import type { ProfitTrendItem } from "../../model/financial-report/financial-report.types";

interface ProfitTrendChartProps {
  data: ProfitTrendItem[];
  isLoading?: boolean;
}

function ProfitTrendChart({ data, isLoading = false }: ProfitTrendChartProps) {
  const hasManyMonths = data.length > 6;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-700">
            <LineChartIcon className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Tendência de lucro
            </CardTitle>
            <p className="text-sm text-slate-500">
              Evolução mensal do lucro ao longo do tempo
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existe tendência de lucro disponível.
          </div>
        ) : (
          <div className={hasManyMonths ? "overflow-x-auto" : undefined}>
            <div
              className="h-[320px]"
              style={{
                minWidth: hasManyMonths ? `${data.length * 72}px` : undefined,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="label"
                    stroke="#64748b"
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    minTickGap={0}
                  />
                  <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
                  <Tooltip formatter={(value) => `€${value}`} />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Lucro"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { ProfitTrendChart };
