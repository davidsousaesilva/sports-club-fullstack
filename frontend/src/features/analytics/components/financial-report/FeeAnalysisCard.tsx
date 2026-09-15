import { Tags } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { FeeTypeAnalysisItem } from "../../model/financial-report/financial-report.types";

interface FeeAnalysisCardProps {
  data?: FeeTypeAnalysisItem[];
  isLoading?: boolean;
}

function FeeAnalysisCard({
  data = [],
  isLoading = false,
}: FeeAnalysisCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-cyan-100 p-2.5 text-cyan-700">
            <Tags className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Análise de quotas por tipo
            </CardTitle>
            <p className="text-sm text-slate-500">
              Quantidade e valor médio por tipo de quota
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-slate-100"
            />
          ))
        ) : data.length === 0 ? (
          <div className="flex h-[240px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existe análise de quotas disponível.
          </div>
        ) : (
          data.map((item) => (
            <div key={item.id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">Valor médio</p>
                  <p className="mt-1 text-lg font-semibold text-slate-950">
                    €{item.average.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export { FeeAnalysisCard };
