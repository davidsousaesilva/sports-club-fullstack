import { FinancePageContent } from "../components/FinancePageContent";
import { useFinance } from "../hooks/use-finance";

function FinancePage() {
  const {
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
    setStatus,
    setType,
    setAthleteSearch,
    refetch,
    registerCashPayment,
    registerMultibancoInPersonPayment,
    startMultibancoOnlinePayment,
    simulateGatewayConfirmation,
    isSimulatingGatewayConfirmation,
    closeOnlinePayment,
    cancelPayment,
    updateInPersonPayment,
    deleteInPersonPayment,
    loadPaymentByFee,
    loadFeeByPayment,
    isLoading,
    isFetching,
    isSubmittingCashPayment,
    isSubmittingInPersonMbPayment,
    isStartingOnlinePayment,
    isPollingOnlinePaymentStatus,
    isCancellingPayment,
    isUpdatingPayment,
    isDeletingPayment,
    isLoadingRelatedPayment,
    isLoadingRelatedFee,
  } = useFinance();

  return (
    <FinancePageContent
      scope={scope}
      canManageFinance={canManageFinance}
      fees={fees}
      debts={debts}
      payments={payments}
      relatedPayment={relatedPayment}
      relatedFee={relatedFee}
      onlinePayment={onlinePayment}
      activeOnlineFeeId={activeOnlineFeeId}
      isOnlinePaymentDialogOpen={isOnlinePaymentDialogOpen}
      selectedStatus={selectedStatus}
      selectedType={selectedType}
      athleteSearch={athleteSearch}
      onStatusChange={setStatus}
      onTypeChange={setType}
      onAthleteSearchChange={setAthleteSearch}
      onRefresh={refetch}
      onRegisterCashPayment={registerCashPayment}
      onRegisterMultibancoInPersonPayment={registerMultibancoInPersonPayment}
      onStartMultibancoOnlinePayment={startMultibancoOnlinePayment}
      onSimulateGatewayConfirmation={simulateGatewayConfirmation}
      isSimulatingGatewayConfirmation={isSimulatingGatewayConfirmation}
      onCloseOnlinePayment={closeOnlinePayment}
      onCancelPayment={cancelPayment}
      onUpdateInPersonPayment={updateInPersonPayment}
      onDeleteInPersonPayment={deleteInPersonPayment}
      onLoadPaymentByFee={loadPaymentByFee}
      onLoadFeeByPayment={loadFeeByPayment}
      isLoading={isLoading}
      isFetching={isFetching}
      isSubmittingCashPayment={isSubmittingCashPayment}
      isSubmittingInPersonMbPayment={isSubmittingInPersonMbPayment}
      isStartingOnlinePayment={isStartingOnlinePayment}
      isPollingOnlinePaymentStatus={isPollingOnlinePaymentStatus}
      isCancellingPayment={isCancellingPayment}
      isUpdatingPayment={isUpdatingPayment}
      isDeletingPayment={isDeletingPayment}
      isLoadingRelatedPayment={isLoadingRelatedPayment}
      isLoadingRelatedFee={isLoadingRelatedFee}
    />
  );
}

export { FinancePage };
