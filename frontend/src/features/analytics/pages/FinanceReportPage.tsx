import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Download,
  Euro,
} from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import { useFinancialReport } from "../hooks/use-financial-report";
import { FinanceReportStatsGrid } from "../components/financial-report/FinanceReportStatsGrid";
import { FinancialAnalysisChart } from "../components/financial-report/FinancialAnalysisChart";
import { ProfitTrendChart } from "../components/financial-report/ProfitTrendChart";
import { FeeStatusChart } from "../components/financial-report/FeeStatusChart";
import { RevenuesBySourceCard } from "../components/financial-report/RevenuesBySourceCard";
import { FeeAnalysisCard } from "../components/financial-report/FeeAnalysisCard";
import { PaymentMethodsCard } from "../components/financial-report/PaymentMethodsCard";

function FinanceReportPage() {
  const { report, isLoading } = useFinancialReport();

  const stats = [
    {
      title: "Total recebido",
      value: `€${report?.totalReceived ?? "0.00"}`,
      description: "Receita total confirmada",
      icon: Euro,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      title: "Dívida",
      value: `€${report?.debt ?? "0.00"}`,
      description: "Montante em dívida",
      icon: AlertCircle,
      iconClassName: "bg-rose-100 text-rose-700",
    },
    {
      title: "Quotas pendentes",
      value: report?.pendingFees ?? 0,
      description: "Quotas a aguardar pagamento",
      icon: CreditCard,
      iconClassName: "bg-amber-100 text-amber-700",
    },
    {
      title: "Taxa de pagamento",
      value: `${report?.paymentRate ?? "0.00"}%`,
      description: "Taxa global de pagamentos concluídos",
      icon: CheckCircle2,
      iconClassName: "bg-blue-100 text-blue-700",
    },
  ];

  return (
    <section className="min-w-0 space-y-6 overflow-x-hidden">
      <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="break-words text-2xl font-semibold text-slate-950">
            Relatório financeiro
          </h1>
          <p className="max-w-2xl break-words text-sm text-slate-600">
            Visão geral do desempenho financeiro em receitas, quotas e métodos
            de pagamento.
          </p>
        </div>
      </header>

      <div className="min-w-0">
        <FinanceReportStatsGrid items={stats} isLoading={isLoading} />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6">
        <FinancialAnalysisChart
          data={report?.financialAnalysis ?? []}
          isLoading={isLoading}
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        <ProfitTrendChart
          data={report?.profitTrend ?? []}
          isLoading={isLoading}
        />
        <FeeStatusChart
          data={report?.feeStatusState ?? []}
          isLoading={isLoading}
        />
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-2">
        <RevenuesBySourceCard
          items={report?.revenuesBySource ?? []}
          isLoading={isLoading}
        />
        <FeeAnalysisCard
          data={report?.feeAnalysisByType}
          isLoading={isLoading}
        />
      </div>

      <div className="min-w-0">
        <PaymentMethodsCard
          data={report?.paymentsByMethod}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
}

export { FinanceReportPage };
