import { BarChart3 } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ComposedChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { FinancialAnalysisItem } from "../../model/financial-report/financial-report.types";

interface FinancialAnalysisChartProps {
  data: FinancialAnalysisItem[];
  isLoading?: boolean;
}

function FinancialAnalysisChart({
  data,
  isLoading = false,
}: FinancialAnalysisChartProps) {
  const hasManyMonths = data.length > 6;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Análise financeira mensal
            </CardTitle>
            <p className="text-sm text-slate-500">
              Visão geral de receitas e despesas por período
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[340px] animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-[340px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existe análise financeira disponível.
          </div>
        ) : (
          <div className={hasManyMonths ? "overflow-x-auto" : undefined}>
            <div
              className="h-[340px]"
              style={{
                minWidth: hasManyMonths ? `${data.length * 72}px` : undefined,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
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
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name="Receita"
                    fill="#059669"
                    radius={[8, 8, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Despesa"
                    fill="#dc2626"
                    radius={[8, 8, 0, 0]}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { FinancialAnalysisChart };
