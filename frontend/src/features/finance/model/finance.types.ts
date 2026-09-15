export type FeeType = "REGISTRATION" | "MONTHLYFEE" | "COMPETITIONFEE";
export type FeeStatus = "UNPAID" | "PAID" | "DEBT";

export type PaymentMethod = "CASH" | "MULTIBANCO" | "CARD";
export type PaymentChannel = "INPERSON" | "ONLINE";
export type PaymentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "FAILED"
  | "EXPIRED";

export type ExternalPaymentStatus =
  | "NONE"
  | "PENDING"
  | "WAITING"
  | "AUTHORIZED"
  | "CAPTURED"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED";

export type FinanceScope = "MANAGER" | "ATHLETE";

export type FeeFilterStatus = FeeStatus | "ALL";
export type FeeFilterType = FeeType | "ALL";

export interface FeeFilterValues {
  status: FeeFilterStatus;
  type: FeeFilterType;
  athleteName: string;
}

export interface FeeResponseDto {
  id: number;
  version: number;
  creationDate: string;
  dueDate: string;
  type: FeeType;
  amount: string;
  status: FeeStatus;
  paymentId: number | null;
  nextCycle: string | null;
  recurrent: boolean;
  athleteId: number;
  athleteName: string | null;
  competitionTeamOriginId: number | null;
  teamId: number | null;
  teamName: string | null;
}

export interface PaymentResponseDto {
  id: number;
  version: number;
  creationDate: string;
  confirmationDate: string | null;
  limitDate: string | null;
  method: PaymentMethod;
  channel: PaymentChannel;
  originalAmount: string;
  confirmedAmount: string;
  mbEntity: string | null;
  mbReference: string | null;
  status: PaymentStatus;
  gateway: string | null;
  externalId: string | null;
  externalStatus: ExternalPaymentStatus;
  terminalId: string | null;
  collaboratorId: number | null;
  feeId: number;
}

export interface MultibancoPaymentDataResponseDto {
  entity: string;
  reference: string;
  amount: string;
  limitDate: string;
  status: PaymentStatus;
}

export interface PaymentStatusResponseDto {
  paymentId: number;
  status: PaymentStatus;
  externalStatus: ExternalPaymentStatus;
  confirmationDate: string | null;
  canBeCancelled: boolean;
}

export interface StartMultibancoOnlineResponseDto {
  paymentId: number;
  entity: string;
  reference: string;
  externalId: string;
  amount: string;
  validUntil: string;
  status: PaymentStatus;
}

export interface FeeItem {
  id: number;
  version: number;
  creationDate: string;
  dueDate: string;
  type: FeeType;
  amount: number;
  status: FeeStatus;
  paymentId: number | null;
  nextCycle: string | null;
  recurrent: boolean;
  athleteId: number;
  athleteName: string | null;
  competitionTeamOriginId: number | null;
  teamId: number | null;
  teamName: string | null;
}

export interface PaymentItem {
  id: number;
  version: number;
  creationDate: string;
  confirmationDate: string | null;
  limitDate: string | null;
  method: PaymentMethod;
  channel: PaymentChannel;
  originalAmount: number;
  confirmedAmount: number;
  mbEntity: string | null;
  mbReference: string | null;
  status: PaymentStatus;
  gateway: string | null;
  externalId: string | null;
  externalStatus: ExternalPaymentStatus;
  terminalId: string | null;
  collaboratorId: number | null;
  feeId: number;
  feeAthleteId: number | null;
  canBeCancelled: boolean;
}

export interface MultibancoPaymentData {
  entity: string;
  reference: string;
  amount: number;
  limitDate: string;
  status: PaymentStatus;
}

export interface PaymentStatusData {
  paymentId: number;
  status: PaymentStatus;
  externalStatus: ExternalPaymentStatus;
  confirmationDate: string | null;
  canBeCancelled: boolean;
}

export interface StartMultibancoOnlineResponse {
  paymentId: number;
  entity: string;
  reference: string;
  externalId: string;
  amount: number;
  validUntil: string;
  status: PaymentStatus;
}

export interface OnlinePaymentDetails {
  paymentId: number;
  feeId: number;
  entity: string;
  reference: string;
  externalId: string;
  amount: number;
  validUntil: string;
  status: PaymentStatus;
  externalStatus: ExternalPaymentStatus;
  confirmationDate: string | null;
  canBeCancelled: boolean;
}

export interface RegisterCashPaymentRequestDto {
  feeId: number;
  confirmedAmount: number;
  collaboratorId: number;
}

export interface RegisterMultibancoPresencialRequestDto {
  feeId: number;
  confirmedAmount: number;
  mbEntity: string;
  mbReference: string;
  limitDate: string;
  terminalId: string;
  collaboratorId: number;
}

export interface StartMultibancoOnlineRequestDto {
  feeId: number;
  originalAmount: number;
}

export interface UpdateInPersonPaymentRequestDto {
  version: number;
  method: PaymentMethod;
  confirmedAmount: number;
  mbEntity: string | null;
  mbReference: string | null;
  limitDate: string | null;
  terminalId: string | null;
}

export interface PaymentVersionRequestDto {
  version: number;
}

export interface RegisterCashPaymentFormValues {
  feeId: number;
  confirmedAmount: number;
  collaboratorId: number;
}

export interface RegisterMultibancoInPersonPaymentFormValues {
  feeId: number;
  confirmedAmount: number;
  mbEntity: string;
  mbReference: string;
  limitDate: string;
  terminalId: string;
  collaboratorId: number;
}

export interface StartMultibancoOnlineFormValues {
  feeId: number;
  originalAmount: number;
}

export interface UpdateInPersonPaymentFormValues {
  method: PaymentMethod;
  confirmedAmount: number;
  mbEntity: string | null;
  mbReference: string | null;
  limitDate: string | null;
  terminalId: string | null;
}