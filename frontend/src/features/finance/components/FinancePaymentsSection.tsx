import { useState } from "react";

import { FinancePaymentCard } from "./FinancePaymentCard";
import {
  FinancePaymentEditDialog,
  type EditPaymentDialogState,
} from "./FinancePaymentEditDialog";
import {
  FinancePaymentFeeDetailsDialog,
  type RelatedFeeDialogState,
} from "./FinancePaymentFeeDetailsDialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/components/ui/card/Card";
import type {
  FeeItem,
  PaymentItem,
  PaymentMethod,
  UpdateInPersonPaymentFormValues,
} from "../model/finance.types";

type FinancePaymentsSectionProps = {
  payments: PaymentItem[];
  canManageFinance: boolean;
  isLoading: boolean;
  isCancellingPayment: boolean;
  isUpdatingPayment: boolean;
  isDeletingPayment: boolean;
  relatedFee: FeeItem | null;
  isLoadingRelatedFee: boolean;
  onLoadFeeByPayment: (paymentId: number) => Promise<FeeItem | null>;
  onCancelPayment: (payment: PaymentItem) => Promise<unknown>;
  onUpdateInPersonPayment: (
    payment: PaymentItem,
    values: UpdateInPersonPaymentFormValues,
  ) => Promise<unknown>;
  onDeleteInPersonPayment: (payment: PaymentItem) => Promise<unknown>;
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

function createEditState(payment: PaymentItem): EditPaymentDialogState {
  return {
    isOpen: true,
    payment,
    method: payment.method,
    confirmedAmount: payment.confirmedAmount.toFixed(2),
    mbEntity: payment.mbEntity ?? "",
    mbReference: payment.mbReference ?? "",
    limitDate: toDateTimeLocalValue(payment.limitDate),
    terminalId: payment.terminalId ?? "",
  };
}

function createClosedEditState(): EditPaymentDialogState {
  return {
    isOpen: false,
    payment: null,
    method: "MULTIBANCO" as PaymentMethod,
    confirmedAmount: "",
    mbEntity: "",
    mbReference: "",
    limitDate: "",
    terminalId: "",
  };
}

function createClosedRelatedFeeDialog(): RelatedFeeDialogState {
  return {
    isOpen: false,
    payment: null,
  };
}

function FinancePaymentsSection({
  payments,
  canManageFinance,
  isLoading,
  isCancellingPayment,
  isUpdatingPayment,
  isDeletingPayment,
  relatedFee,
  isLoadingRelatedFee,
  onLoadFeeByPayment,
  onCancelPayment,
  onUpdateInPersonPayment,
  onDeleteInPersonPayment,
}: FinancePaymentsSectionProps) {
  const [editDialog, setEditDialog] = useState<EditPaymentDialogState>(
    createClosedEditState(),
  );
  const [relatedFeeDialog, setRelatedFeeDialog] =
    useState<RelatedFeeDialogState>(createClosedRelatedFeeDialog());

  const closeEditDialog = () => {
    setEditDialog(createClosedEditState());
  };

  const closeRelatedFeeDialog = () => {
    setRelatedFeeDialog(createClosedRelatedFeeDialog());
  };

  const handleOpenRelatedFee = async (payment: PaymentItem) => {
    setRelatedFeeDialog({
      isOpen: true,
      payment,
    });

    await onLoadFeeByPayment(payment.id);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Pagamentos</CardTitle>
          <CardDescription>
            Operações de pagamento registadas e respetivo estado mais recente.
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
          ) : payments.length === 0 ? (
            <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
              Não foram encontrados pagamentos para o contexto atual.
            </div>
          ) : (
            <div className="space-y-3">
              {payments.map((payment) => (
                <FinancePaymentCard
                  key={payment.id}
                  payment={payment}
                  canManageFinance={canManageFinance}
                  isCancellingPayment={isCancellingPayment}
                  isDeletingPayment={isDeletingPayment}
                  onOpenRelatedFee={(selectedPayment) => {
                    void handleOpenRelatedFee(selectedPayment);
                  }}
                  onCancelPayment={onCancelPayment}
                  onEditPayment={(selectedPayment) =>
                    setEditDialog(createEditState(selectedPayment))
                  }
                  onDeleteInPersonPayment={onDeleteInPersonPayment}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <FinancePaymentEditDialog
        dialog={editDialog}
        isUpdatingPayment={isUpdatingPayment}
        onDialogChange={(updater) =>
          setEditDialog((current) =>
            typeof updater === "function" ? updater(current) : updater,
          )
        }
        onClose={closeEditDialog}
        onSubmit={onUpdateInPersonPayment}
      />

      <FinancePaymentFeeDetailsDialog
        dialog={relatedFeeDialog}
        relatedFee={relatedFee}
        isLoadingRelatedFee={isLoadingRelatedFee}
        onClose={closeRelatedFeeDialog}
      />
    </>
  );
}

export { FinancePaymentsSection };