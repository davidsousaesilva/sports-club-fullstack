import type {
  FeeItem,
  FeeResponseDto,
  MultibancoPaymentData,
  MultibancoPaymentDataResponseDto,
  PaymentItem,
  PaymentResponseDto,
  PaymentStatusData,
  PaymentStatusResponseDto,
  RegisterCashPaymentFormValues,
  RegisterCashPaymentRequestDto,
  RegisterMultibancoInPersonPaymentFormValues,
  RegisterMultibancoPresencialRequestDto,
  StartMultibancoOnlineFormValues,
  StartMultibancoOnlineRequestDto,
  StartMultibancoOnlineResponse,
  StartMultibancoOnlineResponseDto,
  UpdateInPersonPaymentFormValues,
  UpdateInPersonPaymentRequestDto,
} from "./finance.types";

function toNumber(value: string | number | null | undefined): number {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value ?? 0);

  return Number.isNaN(parsed) ? 0 : parsed;
}

function mapFee(dto: FeeResponseDto): FeeItem {
  return {
    id: dto.id,
    version: dto.version,
    creationDate: dto.creationDate,
    dueDate: dto.dueDate,
    type: dto.type,
    amount: toNumber(dto.amount),
    status: dto.status,
    paymentId: dto.paymentId,
    nextCycle: dto.nextCycle,
    recurrent: dto.recurrent,
    athleteId: dto.athleteId,
    athleteName: dto.athleteName,
    competitionTeamOriginId: dto.competitionTeamOriginId,
    teamId: dto.teamId,
    teamName: dto.teamName,
  };
}

function mapPayment(dto: PaymentResponseDto): PaymentItem {
  return {
    id: dto.id,
    version: dto.version,
    creationDate: dto.creationDate,
    confirmationDate: dto.confirmationDate,
    limitDate: dto.limitDate,
    method: dto.method,
    channel: dto.channel,
    originalAmount: toNumber(dto.originalAmount),
    confirmedAmount: toNumber(dto.confirmedAmount),
    mbEntity: dto.mbEntity,
    mbReference: dto.mbReference,
    status: dto.status,
    gateway: dto.gateway,
    externalId: dto.externalId,
    externalStatus: dto.externalStatus,
    terminalId: dto.terminalId,
    collaboratorId: dto.collaboratorId,
    feeId: dto.feeId,
    feeAthleteId: null,
    canBeCancelled: dto.status === "PENDING",
  };
}

function mapMultibancoPaymentData(
  dto: MultibancoPaymentDataResponseDto,
): MultibancoPaymentData {
  return {
    entity: dto.entity,
    reference: dto.reference,
    amount: toNumber(dto.amount),
    limitDate: dto.limitDate,
    status: dto.status,
  };
}

function mapPaymentStatus(dto: PaymentStatusResponseDto): PaymentStatusData {
  return {
    paymentId: dto.paymentId,
    status: dto.status,
    externalStatus: dto.externalStatus,
    confirmationDate: dto.confirmationDate,
    canBeCancelled: dto.canBeCancelled,
  };
}

function mapStartMultibancoOnlineResponse(
  dto: StartMultibancoOnlineResponseDto,
): StartMultibancoOnlineResponse {
  return {
    paymentId: dto.paymentId,
    entity: dto.entity,
    reference: dto.reference,
    externalId: dto.externalId,
    amount: toNumber(dto.amount),
    validUntil: dto.validUntil,
    status: dto.status,
  };
}

function mapCashPaymentRequest(
  values: RegisterCashPaymentFormValues,
): RegisterCashPaymentRequestDto {
  return {
    feeId: values.feeId,
    confirmedAmount: values.confirmedAmount,
    collaboratorId: values.collaboratorId,
  };
}

function mapMultibancoInPersonPaymentRequest(
  values: RegisterMultibancoInPersonPaymentFormValues,
): RegisterMultibancoPresencialRequestDto {
  return {
    feeId: values.feeId,
    confirmedAmount: values.confirmedAmount,
    mbEntity: values.mbEntity.trim(),
    mbReference: values.mbReference.trim(),
    limitDate: values.limitDate,
    terminalId: values.terminalId.trim(),
    collaboratorId: values.collaboratorId,
  };
}

function mapStartMultibancoOnlineRequest(
  values: StartMultibancoOnlineFormValues,
): StartMultibancoOnlineRequestDto {
  return {
    feeId: values.feeId,
    originalAmount: values.originalAmount,
  };
}

function mapUpdateInPersonPaymentRequest(
  values: UpdateInPersonPaymentFormValues,
  version: number,
): UpdateInPersonPaymentRequestDto {
  return {
    version,
    method: values.method,
    confirmedAmount: values.confirmedAmount,
    mbEntity: values.mbEntity,
    mbReference: values.mbReference,
    limitDate: values.limitDate,
    terminalId: values.terminalId,
  };
}

export {
  mapCashPaymentRequest,
  mapFee,
  mapMultibancoInPersonPaymentRequest,
  mapMultibancoPaymentData,
  mapPayment,
  mapPaymentStatus,
  mapStartMultibancoOnlineRequest,
  mapStartMultibancoOnlineResponse,
  mapUpdateInPersonPaymentRequest,
};