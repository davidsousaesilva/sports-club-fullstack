import { Landmark } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../shared/components/ui/card/Card";
import type { PaymentMethodItem } from "../../model/financial-report/financial-report.types";

interface PaymentMethodsCardProps {
  data?: PaymentMethodItem[];
  isLoading?: boolean;
}

function PaymentMethodsCard({
  data = [],
  isLoading = false,
}: PaymentMethodsCardProps) {
  const totals = data.reduce(
    (accumulator, item) => ({
      quantity: accumulator.quantity + item.quantity,
      total: accumulator.total + item.total,
    }),
    {
      quantity: 0,
      total: 0,
    },
  );

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="border-slate-200">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
            <Landmark className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-slate-950">
              Pagamentos por método
            </CardTitle>
            <p className="text-sm text-slate-500">
              Quantidade, total e média por método de pagamento
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-14 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
            Não existe análise disponível por método de pagamento.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-3 text-left font-medium">Método</th>
                  <th className="px-4 py-3 text-right font-medium">Qtd.</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-right font-medium">Média</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 text-slate-700"
                  >
                    <td className="px-4 py-4 font-medium text-slate-950">
                      {item.label}
                    </td>
                    <td className="px-4 py-4 text-right">{item.quantity}</td>
                    <td className="px-4 py-4 text-right font-semibold text-slate-950">
                      €{item.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      €{item.average.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold text-slate-950">
                  <td className="px-4 py-4">Total</td>
                  <td className="px-4 py-4 text-right">{totals.quantity}</td>
                  <td className="px-4 py-4 text-right">
                    €{totals.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 text-right">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { PaymentMethodsCard };
