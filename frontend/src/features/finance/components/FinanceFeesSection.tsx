import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card/Card";
import { FinanceFeeActionDialogs } from "./FinanceFeeActionDialogs";
import type {
  CashPaymentDialogState,
  InPersonPaymentDialogState,
} from "./FinanceFeeActionDialogs";
import { FinanceFeeCard } from "./FinanceFeeCard";
import { FinanceFeePaymentDetailsDialog } from "./FinanceFeePaymentDetailsDialog";
import { FinanceOnlinePaymentDialog } from "./FinanceOnlinePaymentDialog";
import type {
  FeeItem,
  FinanceScope,
  OnlinePaymentDetails,
  PaymentItem,
} from "../model/finance.types";

type FinanceFeesSectionProps = {
  scope: FinanceScope;
  fees: FeeItem[];
  canManageFinance: boolean;
  isLoading: boolean;
  isSubmittingCashPayment: boolean;
  isSubmittingInPersonMbPayment: boolean;
  isStartingOnlinePayment: boolean;
  isSimulatingGatewayConfirmation: boolean;
  isOnlinePaymentDialogOpen: boolean;
  relatedPayment: PaymentItem | null;
  onlinePayment: OnlinePaymentDetails | null;
  activeOnlineFeeId: number | null;
  isPollingOnlinePaymentStatus: boolean;
  isLoadingRelatedPayment: boolean;
  onLoadPaymentByFee: (feeId: number) => Promise<PaymentItem | null>;
  onStartOnlinePayment: (values: {
    feeId: number;
    originalAmount: number;
  }) => Promise<OnlinePaymentDetails>;
  onSimulateGatewayConfirmation: (
    externalPaymentId: string,
  ) => Promise<unknown>;
  onCloseOnlinePayment: () => void;
  onSubmitCashPayment: (values: {
    feeId: number;
    confirmedAmount: number;
    collaboratorId: number;
  }) => Promise<unknown>;
  onSubmitInPersonPayment: (values: {
    feeId: number;
    confirmedAmount: number;
    mbEntity: string;
    mbReference: string;
    limitDate: string;
    terminalId: string;
    collaboratorId: number;
  }) => Promise<unknown>;
};

type PaymentDetailsDialogState = {
  isOpen: boolean;
  fee: FeeItem | null;
};

function toDateTimeLocalValue(value: string | null): string {
  if (!value) {
    return "";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function createClosedCashDialog(): CashPaymentDialogState {
  return {
    isOpen: false,
    fee: null,
    collaboratorId: "",
  };
}

function createClosedInPersonDialog(): InPersonPaymentDialogState {
  return {
    isOpen: false,
    fee: null,
    collaboratorId: "",
    mbEntity: "",
    mbReference: "",
    limitDate: "",
    terminalId: "",
  };
}

function createClosedPaymentDetailsDialog(): PaymentDetailsDialogState {
  return {
    isOpen: false,
    fee: null,
  };
}

function FinanceFeesSection({
  scope,
  fees,
  canManageFinance,
  isLoading,
  isSubmittingCashPayment,
  isSubmittingInPersonMbPayment,
  isStartingOnlinePayment,
  isSimulatingGatewayConfirmation,
  isOnlinePaymentDialogOpen,
  relatedPayment,
  onlinePayment,
  activeOnlineFeeId,
  isPollingOnlinePaymentStatus,
  isLoadingRelatedPayment,
  onLoadPaymentByFee,
  onStartOnlinePayment,
  onSimulateGatewayConfirmation,
  onCloseOnlinePayment,
  onSubmitCashPayment,
  onSubmitInPersonPayment,
}: FinanceFeesSectionProps) {
  const [cashDialog, setCashDialog] = useState<CashPaymentDialogState>(
    createClosedCashDialog(),
  );
  const [inPersonDialog, setInPersonDialog] =
    useState<InPersonPaymentDialogState>(createClosedInPersonDialog());
  const [paymentDetailsDialog, setPaymentDetailsDialog] =
    useState<PaymentDetailsDialogState>(createClosedPaymentDetailsDialog());

  const closeCashDialog = () => {
    setCashDialog(createClosedCashDialog());
  };

  const closeInPersonDialog = () => {
    setInPersonDialog(createClosedInPersonDialog());
  };

  const closePaymentDetailsDialog = () => {
    setPaymentDetailsDialog(createClosedPaymentDetailsDialog());
  };

  const handleCashSubmit = async () => {
    if (!cashDialog.fee) {
      return;
    }

    const collaboratorId = Number(cashDialog.collaboratorId);

    if (!collaboratorId) {
      return;
    }

    await onSubmitCashPayment({
      feeId: cashDialog.fee.id,
      confirmedAmount: cashDialog.fee.amount,
      collaboratorId,
    });

    closeCashDialog();
  };

  const handleInPersonSubmit = async () => {
    if (!inPersonDialog.fee) {
      return;
    }

    const collaboratorId = Number(inPersonDialog.collaboratorId);

    if (
      !collaboratorId ||
      !inPersonDialog.mbEntity ||
      !inPersonDialog.mbReference ||
      !inPersonDialog.limitDate ||
      !inPersonDialog.terminalId
    ) {
      return;
    }

    await onSubmitInPersonPayment({
      feeId: inPersonDialog.fee.id,
      confirmedAmount: inPersonDialog.fee.amount,
      collaboratorId,
      mbEntity: inPersonDialog.mbEntity,
      mbReference: inPersonDialog.mbReference,
      limitDate: new Date(inPersonDialog.limitDate).toISOString(),
      terminalId: inPersonDialog.terminalId,
    });

    closeInPersonDialog();
  };

  const handleOpenPaymentDetails = async (fee: FeeItem) => {
    setPaymentDetailsDialog({
      isOpen: true,
      fee,
    });

    await onLoadPaymentByFee(fee.id);
  };

  const handleStartOnlinePayment = async (fee: FeeItem) => {
    await onStartOnlinePayment({
      feeId: fee.id,
      originalAmount: fee.amount,
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {scope === "ATHLETE"
              ? "As tuas quotas em dívida"
              : "Lista de quotas"}
          </CardTitle>
          <CardDescription>
            {scope === "ATHLETE"
              ? "Apenas quotas pendentes que ainda necessitam de pagamento."
              : "Todas as quotas correspondentes devolvidas pelos filtros do backend."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-24 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : fees.length === 0 ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
              Não foram encontradas quotas para o contexto atual.
            </div>
          ) : (
            <div className="space-y-3">
              {fees.map((fee) => (
                <FinanceFeeCard
                  key={fee.id}
                  fee={fee}
                  canManageFinance={canManageFinance}
                  isStartingOnlinePayment={isStartingOnlinePayment}
                  activeOnlineFeeId={activeOnlineFeeId}
                  onOpenPaymentDetails={(selectedFee) => {
                    void handleOpenPaymentDetails(selectedFee);
                  }}
                  onStartOnlinePayment={(selectedFee) =>
                    handleStartOnlinePayment(selectedFee)
                  }
                  onOpenCashPayment={(selectedFee) =>
                    setCashDialog({
                      isOpen: true,
                      fee: selectedFee,
                      collaboratorId: "",
                    })
                  }
                  onOpenInPersonPayment={(selectedFee) =>
                    setInPersonDialog({
                      isOpen: true,
                      fee: selectedFee,
                      collaboratorId: "",
                      mbEntity: "",
                      mbReference: "",
                      limitDate: toDateTimeLocalValue(selectedFee.dueDate),
                      terminalId: "",
                    })
                  }
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FinanceFeeActionDialogs
        cashDialog={cashDialog}
        inPersonDialog={inPersonDialog}
        isSubmittingCashPayment={isSubmittingCashPayment}
        isSubmittingInPersonMbPayment={isSubmittingInPersonMbPayment}
        onCashDialogChange={(updater) =>
          setCashDialog((current) =>
            typeof updater === "function" ? updater(current) : updater,
          )
        }
        onInPersonDialogChange={(updater) =>
          setInPersonDialog((current) =>
            typeof updater === "function" ? updater(current) : updater,
          )
        }
        onCloseCashDialog={closeCashDialog}
        onCloseInPersonDialog={closeInPersonDialog}
        onSubmitCashPayment={handleCashSubmit}
        onSubmitInPersonPayment={handleInPersonSubmit}
      />

      <FinanceFeePaymentDetailsDialog
        isOpen={paymentDetailsDialog.isOpen}
        fee={paymentDetailsDialog.fee}
        payment={relatedPayment}
        isLoading={isLoadingRelatedPayment}
        onClose={closePaymentDetailsDialog}
      />

      <FinanceOnlinePaymentDialog
        isOpen={isOnlinePaymentDialogOpen}
        fee={fees.find((item) => item.id === activeOnlineFeeId) ?? null}
        payment={onlinePayment}
        isStarting={isStartingOnlinePayment}
        isPolling={isPollingOnlinePaymentStatus}
        isSimulatingConfirmation={isSimulatingGatewayConfirmation}
        onSimulateConfirmation={onSimulateGatewayConfirmation}
        onClose={onCloseOnlinePayment}
      />
    </>
  );
}

export { FinanceFeesSection };