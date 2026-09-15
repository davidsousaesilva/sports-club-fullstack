import { BarChart3 } from "lucide-react";
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
import type { DashboardFinancialSnapshotItem } from "../../model/dashboard/dashboard.types";

interface FinancialSnapshotChartProps {
  data: DashboardFinancialSnapshotItem[];
  isLoading?: boolean;
}

function FinancialSnapshotChart({
  data,
  isLoading = false,
}: FinancialSnapshotChartProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-700">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Resumo financeiro
            </CardTitle>
            <p className="text-sm text-slate-500">
              Receitas e despesas ao longo do último trimestre
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="h-[320px] animate-pulse rounded-xl bg-slate-100" />
        ) : data.length === 0 ? (
          <div className="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existe resumo financeiro disponível.
          </div>
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  width={60}
                  stroke="#64748b"
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) =>
                    typeof value === "number" ? `€${value}` : value
                  }
                />

                <Tooltip
                  formatter={(value) => {
                    if (typeof value === "number") {
                      return `€${value.toFixed(2)}`;
                    }
                    return value;
                  }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    backgroundColor: "#ffffff",
                  }}
                />

                <Bar
                  dataKey="revenue"
                  name="Receita"
                  fill="#10b981"
                  radius={[8, 8, 0, 0]}
                />

                <Bar
                  dataKey="expenses"
                  name="Despesa"
                  fill="#ef4444"
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

export { FinancialSnapshotChart };
