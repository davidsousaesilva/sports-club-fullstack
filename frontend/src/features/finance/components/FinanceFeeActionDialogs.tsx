import { Banknote, CreditCard, Loader2 } from "lucide-react";

import { Button } from "../../../shared/components/ui/button/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog/Dialog";
import type { FeeItem } from "../model/finance.types";

type CashPaymentDialogState = {
  isOpen: boolean;
  fee: FeeItem | null;
  collaboratorId: string;
};

type InPersonPaymentDialogState = {
  isOpen: boolean;
  fee: FeeItem | null;
  collaboratorId: string;
  mbEntity: string;
  mbReference: string;
  limitDate: string;
  terminalId: string;
};

type FinanceFeeActionDialogsProps = {
  cashDialog: CashPaymentDialogState;
  inPersonDialog: InPersonPaymentDialogState;
  isSubmittingCashPayment: boolean;
  isSubmittingInPersonMbPayment: boolean;
  onCashDialogChange: (
    updater:
      | CashPaymentDialogState
      | ((current: CashPaymentDialogState) => CashPaymentDialogState),
  ) => void;
  onInPersonDialogChange: (
    updater:
      | InPersonPaymentDialogState
      | ((current: InPersonPaymentDialogState) => InPersonPaymentDialogState),
  ) => void;
  onCloseCashDialog: () => void;
  onCloseInPersonDialog: () => void;
  onSubmitCashPayment: () => Promise<void>;
  onSubmitInPersonPayment: () => Promise<void>;
};

function FinanceFeeActionDialogs({
  cashDialog,
  inPersonDialog,
  isSubmittingCashPayment,
  isSubmittingInPersonMbPayment,
  onCashDialogChange,
  onInPersonDialogChange,
  onCloseCashDialog,
  onCloseInPersonDialog,
  onSubmitCashPayment,
  onSubmitInPersonPayment,
}: FinanceFeeActionDialogsProps) {
  return (
    <>
      <Dialog
        open={cashDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onCloseCashDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registar pagamento em numerário</DialogTitle>
            <DialogDescription>
              Confirme um pagamento cobrado diretamente por um colaborador.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <input
              value={cashDialog.fee ? String(cashDialog.fee.id) : ""}
              readOnly
              placeholder="ID da quota"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
            />
            <input
              value={cashDialog.fee ? cashDialog.fee.amount.toFixed(2) : ""}
              readOnly
              placeholder="Montante confirmado"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
            />
            <input
              value={cashDialog.collaboratorId}
              onChange={(event) =>
                onCashDialogChange((current) => ({
                  ...current,
                  collaboratorId: event.target.value,
                }))
              }
              placeholder="ID do colaborador"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseCashDialog}
              disabled={isSubmittingCashPayment}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                void onSubmitCashPayment();
              }}
              disabled={isSubmittingCashPayment}
            >
              {isSubmittingCashPayment ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Banknote className="h-4 w-4" />
              )}
              Submeter pagamento em numerário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={inPersonDialog.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onCloseInPersonDialog();
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registar Multibanco presencial</DialogTitle>
            <DialogDescription>
              Crie um pagamento com entidade, referência e terminal.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <input
              value={inPersonDialog.fee ? String(inPersonDialog.fee.id) : ""}
              readOnly
              placeholder="ID da quota"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
            />
            <input
              value={
                inPersonDialog.fee ? inPersonDialog.fee.amount.toFixed(2) : ""
              }
              readOnly
              placeholder="Montante confirmado"
              className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600 outline-none"
            />
            <input
              value={inPersonDialog.mbEntity}
              onChange={(event) =>
                onInPersonDialogChange((current) => ({
                  ...current,
                  mbEntity: event.target.value,
                }))
              }
              placeholder="Entidade MB"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <input
              value={inPersonDialog.mbReference}
              onChange={(event) =>
                onInPersonDialogChange((current) => ({
                  ...current,
                  mbReference: event.target.value,
                }))
              }
              placeholder="Referência MB"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <input
              type="datetime-local"
              value={inPersonDialog.limitDate}
              onChange={(event) =>
                onInPersonDialogChange((current) => ({
                  ...current,
                  limitDate: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <input
              value={inPersonDialog.terminalId}
              onChange={(event) =>
                onInPersonDialogChange((current) => ({
                  ...current,
                  terminalId: event.target.value,
                }))
              }
              placeholder="ID do terminal"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <input
              value={inPersonDialog.collaboratorId}
              onChange={(event) =>
                onInPersonDialogChange((current) => ({
                  ...current,
                  collaboratorId: event.target.value,
                }))
              }
              placeholder="ID do colaborador"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseInPersonDialog}
              disabled={isSubmittingInPersonMbPayment}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                void onSubmitInPersonPayment();
              }}
              disabled={isSubmittingInPersonMbPayment}
            >
              {isSubmittingInPersonMbPayment ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Submeter pagamento presencial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export type { CashPaymentDialogState, InPersonPaymentDialogState };
export { FinanceFeeActionDialogs };
