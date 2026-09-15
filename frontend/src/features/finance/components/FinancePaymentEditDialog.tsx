import { Loader2, Pencil } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog/Dialog";
import type {
  PaymentItem,
  PaymentMethod,
  UpdateInPersonPaymentFormValues,
} from "../model/finance.types";

type EditPaymentDialogState = {
  isOpen: boolean;
  payment: PaymentItem | null;
  method: PaymentMethod;
  confirmedAmount: string;
  mbEntity: string;
  mbReference: string;
  limitDate: string;
  terminalId: string;
};

type FinancePaymentEditDialogProps = {
  dialog: EditPaymentDialogState;
  isUpdatingPayment: boolean;
  onDialogChange: (
    updater:
      | EditPaymentDialogState
      | ((current: EditPaymentDialogState) => EditPaymentDialogState),
  ) => void;
  onClose: () => void;
  onSubmit: (
    payment: PaymentItem,
    values: UpdateInPersonPaymentFormValues,
  ) => Promise<unknown>;
};

async function submitForm(
  dialog: EditPaymentDialogState,
  onSubmit: (
    payment: PaymentItem,
    values: UpdateInPersonPaymentFormValues,
  ) => Promise<unknown>,
  onClose: () => void,
): Promise<void> {
  const confirmedAmount = Number(dialog.confirmedAmount);

  if (!dialog.payment || !confirmedAmount) {
    return;
  }

  await onSubmit(dialog.payment, {
    method: dialog.method,
    confirmedAmount,
    mbEntity: dialog.mbEntity || null,
    mbReference: dialog.mbReference || null,
    limitDate: dialog.limitDate
      ? new Date(dialog.limitDate).toISOString()
      : null,
    terminalId: dialog.terminalId || null,
  });

  onClose();
}

function FinancePaymentEditDialog({
  dialog,
  isUpdatingPayment,
  onDialogChange,
  onClose,
  onSubmit,
}: FinancePaymentEditDialogProps) {
  return (
    <Dialog
      open={dialog.isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atualizar pagamento presencial</DialogTitle>
          <DialogDescription>
            Edite os principais campos de um registo de pagamento presencial.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <input
            value={
              dialog.payment
                ? `Pagamento #${dialog.payment.id} · versão ${dialog.payment.version}`
                : ""
            }
            readOnly
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
          />

          <select
            value={dialog.method}
            onChange={(event) =>
              onDialogChange((current) => ({
                ...current,
                method: event.target.value as PaymentMethod,
              }))
            }
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
          >
            <option value="CASH">Numerário</option>
            <option value="MULTIBANCO">Multibanco</option>
            <option value="CARD">Cartão</option>
          </select>

          <input
            value={dialog.confirmedAmount}
            onChange={(event) =>
              onDialogChange((current) => ({
                ...current,
                confirmedAmount: event.target.value,
              }))
            }
            placeholder="Montante confirmado"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />

          <input
            value={dialog.mbEntity}
            onChange={(event) =>
              onDialogChange((current) => ({
                ...current,
                mbEntity: event.target.value,
              }))
            }
            placeholder="Entidade MB"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />

          <input
            value={dialog.mbReference}
            onChange={(event) =>
              onDialogChange((current) => ({
                ...current,
                mbReference: event.target.value,
              }))
            }
            placeholder="Referência MB"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="datetime-local"
            value={dialog.limitDate}
            onChange={(event) =>
              onDialogChange((current) => ({
                ...current,
                limitDate: event.target.value,
              }))
            }
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />

          <input
            value={dialog.terminalId}
            onChange={(event) =>
              onDialogChange((current) => ({
                ...current,
                terminalId: event.target.value,
              }))
            }
            placeholder="ID do terminal"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isUpdatingPayment}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => {
              void submitForm(dialog, onSubmit, onClose);
            }}
            disabled={isUpdatingPayment}
          >
            {isUpdatingPayment ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Pencil className="h-4 w-4" />
            )}
            Atualizar pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { EditPaymentDialogState };
export { FinancePaymentEditDialog };