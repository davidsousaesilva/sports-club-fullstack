import { useMemo, useState } from "react";
import { Receipt, Wallet } from "lucide-react";

import { FinanceFeeFilters } from "./FinanceFeeFilters";
import { FinanceFeesSection } from "./FinanceFeesSection";
import { FinancePaymentsSection } from "./FinancePaymentsSection";
import { FinanceStatsGrid } from "./FinanceStatsGrid";
import type {
  FeeFilterStatus,
  FeeFilterType,
  FeeItem,
  FinanceScope,
  OnlinePaymentDetails,
  PaymentItem,
  RegisterCashPaymentFormValues,
  RegisterMultibancoInPersonPaymentFormValues,
  StartMultibancoOnlineFormValues,
  UpdateInPersonPaymentFormValues,
} from "../model/finance.types";

type FinancePageContentProps = {
  scope: FinanceScope;
  canManageFinance: boolean;
  fees: FeeItem[];
  debts: FeeItem[];
  payments: PaymentItem[];
  relatedPayment: PaymentItem | null;
  relatedFee: FeeItem | null;
  onlinePayment: OnlinePaymentDetails | null;
  activeOnlineFeeId: number | null;
  isOnlinePaymentDialogOpen: boolean;
  selectedStatus: FeeFilterStatus;
  selectedType: FeeFilterType;
  athleteSearch: string;
  onStatusChange: (value: FeeFilterStatus) => void;
  onTypeChange: (value: FeeFilterType) => void;
  onAthleteSearchChange: (value: string) => void;
  onRefresh: () => Promise<unknown>;
  onRegisterCashPayment: (
    values: RegisterCashPaymentFormValues,
  ) => Promise<unknown>;
  onRegisterMultibancoInPersonPayment: (
    values: RegisterMultibancoInPersonPaymentFormValues,
  ) => Promise<unknown>;
  onStartMultibancoOnlinePayment: (
    values: StartMultibancoOnlineFormValues,
  ) => Promise<OnlinePaymentDetails>;
  onSimulateGatewayConfirmation: (
    externalPaymentId: string,
  ) => Promise<unknown>;
  onCloseOnlinePayment: () => void;
  onCancelPayment: (payment: PaymentItem) => Promise<unknown>;
  onUpdateInPersonPayment: (
    payment: PaymentItem,
    values: UpdateInPersonPaymentFormValues,
  ) => Promise<unknown>;
  onDeleteInPersonPayment: (payment: PaymentItem) => Promise<unknown>;
  onLoadPaymentByFee: (feeId: number) => Promise<PaymentItem | null>;
  onLoadFeeByPayment: (paymentId: number) => Promise<FeeItem | null>;
  isLoading: boolean;
  isFetching: boolean;
  isSubmittingCashPayment: boolean;
  isSubmittingInPersonMbPayment: boolean;
  isStartingOnlinePayment: boolean;
  isSimulatingGatewayConfirmation: boolean;
  isPollingOnlinePaymentStatus: boolean;
  isCancellingPayment: boolean;
  isUpdatingPayment: boolean;
  isDeletingPayment: boolean;
  isLoadingRelatedPayment: boolean;
  isLoadingRelatedFee: boolean;
};

type FinanceTab = "fees" | "payments";

function FinancePageContent({
  scope,
  canManageFinance,
  fees,
  debts,
  payments,
  relatedPayment,
  relatedFee,
  onlinePayment,
  activeOnlineFeeId,
  isOnlinePaymentDialogOpen,
  selectedStatus,
  selectedType,
  athleteSearch,
  onStatusChange,
  onTypeChange,
  onAthleteSearchChange,
  onRegisterCashPayment,
  onRegisterMultibancoInPersonPayment,
  onStartMultibancoOnlinePayment,
  onSimulateGatewayConfirmation,
  onCloseOnlinePayment,
  onCancelPayment,
  onUpdateInPersonPayment,
  onDeleteInPersonPayment,
  onLoadPaymentByFee,
  onLoadFeeByPayment,
  isLoading,
  isSubmittingCashPayment,
  isSubmittingInPersonMbPayment,
  isStartingOnlinePayment,
  isSimulatingGatewayConfirmation,
  isPollingOnlinePaymentStatus,
  isCancellingPayment,
  isUpdatingPayment,
  isDeletingPayment,
  isLoadingRelatedPayment,
  isLoadingRelatedFee,
}: FinancePageContentProps) {
  const [activeTab, setActiveTab] = useState<FinanceTab>("fees");

  const summary = useMemo(() => {
    const totalFees = fees.length;
    const debtFees = fees.filter((fee) => fee.status === "DEBT");
    const totalDebtItems = debtFees.length;
    const totalDebtAmount = debtFees.reduce((sum, item) => sum + item.amount, 0);
    const confirmedPayments = payments.filter(
      (item) => item.status === "CONFIRMED",
    ).length;
    const pendingPayments = payments.filter(
      (item) => item.status === "PENDING",
    ).length;

    return {
      totalFees,
      totalDebtItems,
      totalDebtAmount,
      confirmedPayments,
      pendingPayments,
    };
  }, [debts, fees, payments]);

  const visibleFees = fees;

  return (
    <section className="space-y-6">
      <header className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-slate-950">Finanças</h1>
            <p className="text-sm text-slate-600">
              {scope === "ATHLETE"
                ? "Acompanha as tuas quotas, dívidas e pagamentos."
                : "Gere quotas e pagamentos em todo o clube."}
            </p>
          </div>
        </div>

        <FinanceStatsGrid summary={summary} />
      </header>

      <nav className="border-b border-slate-200">
        <div className="-mb-px flex items-center gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("fees")}
            className={`inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
              activeTab === "fees"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <Receipt className="h-4 w-4" />
            Quotas
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("payments")}
            className={`inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-medium transition ${
              activeTab === "payments"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            <Wallet className="h-4 w-4" />
            Pagamentos
          </button>
        </div>
      </nav>

      {activeTab === "fees" ? (
        <div className="space-y-6">
          <FinanceFeeFilters
            scope={scope}
            selectedStatus={selectedStatus}
            selectedType={selectedType}
            athleteSearch={athleteSearch}
            onStatusChange={onStatusChange}
            onTypeChange={onTypeChange}
            onAthleteSearchChange={onAthleteSearchChange}
          />

          <FinanceFeesSection
            scope={scope}
            fees={visibleFees}
            canManageFinance={canManageFinance}
            isLoading={isLoading}
            isSubmittingCashPayment={isSubmittingCashPayment}
            isSubmittingInPersonMbPayment={isSubmittingInPersonMbPayment}
            isStartingOnlinePayment={isStartingOnlinePayment}
            isSimulatingGatewayConfirmation={isSimulatingGatewayConfirmation}
            isOnlinePaymentDialogOpen={isOnlinePaymentDialogOpen}
            relatedPayment={relatedPayment}
            onlinePayment={onlinePayment}
            activeOnlineFeeId={activeOnlineFeeId}
            isPollingOnlinePaymentStatus={isPollingOnlinePaymentStatus}
            isLoadingRelatedPayment={isLoadingRelatedPayment}
            onLoadPaymentByFee={onLoadPaymentByFee}
            onStartOnlinePayment={onStartMultibancoOnlinePayment}
            onSimulateGatewayConfirmation={onSimulateGatewayConfirmation}
            onCloseOnlinePayment={onCloseOnlinePayment}
            onSubmitCashPayment={onRegisterCashPayment}
            onSubmitInPersonPayment={onRegisterMultibancoInPersonPayment}
          />
        </div>
      ) : (
        <FinancePaymentsSection
          payments={payments}
          canManageFinance={canManageFinance}
          isLoading={isLoading}
          isCancellingPayment={isCancellingPayment}
          isUpdatingPayment={isUpdatingPayment}
          isDeletingPayment={isDeletingPayment}
          relatedFee={relatedFee}
          isLoadingRelatedFee={isLoadingRelatedFee}
          onLoadFeeByPayment={onLoadFeeByPayment}
          onCancelPayment={onCancelPayment}
          onUpdateInPersonPayment={onUpdateInPersonPayment}
          onDeleteInPersonPayment={onDeleteInPersonPayment}
        />
      )}
    </section>
  );
}

export { FinancePageContent };