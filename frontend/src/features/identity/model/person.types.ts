export type PersonRole = "MANAGER" | "EMPLOYEE" | "COACH" | "ATHLETE";
export type Gender = "MALE" | "FEMALE";
export type PersonActiveFilter = "ALL" | "ACTIVE" | "INACTIVE";

export interface PersonRoleResponseDto {
  id: number;
  version: number;
  role: PersonRole;
  startDate: string;
  endDate: string | null;
  primaryRole: boolean;
  endJustification: string | null;
  personId: number;
}

export interface PersonResponseDto {
  id: number;
  version: number;
  name: string;
  gender: Gender;
  email: string;
  phone: string | null;
  address: string | null;
  birthDate: string;
  entryDate: string;
  active: boolean;
  activeRoles: PersonRoleResponseDto[];
  roleHistory?: PersonRoleResponseDto[];
}

export interface CreatePersonRequestDto {
  name: string;
  gender: Gender;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  entryDate: string;
  active: boolean;
}

export interface UpdatePersonRequestDto {
  version: number;
  name: string;
  gender: Gender;
  email: string;
  phone: string | null;
  address: string | null;
  birthDate: string;
  entryDate: string;
  active: boolean;
}

export interface AssignRoleRequestDto {
  role: PersonRole;
  startDate: string;
  endDate: string | null;
  primaryRole: boolean;
  endJustification: string | null;
}

export interface TerminateRoleRequestDto {
  version: number;
  endJustification: string;
}

export interface AlterPasswordRequestDto {
  currentPassword: string;
  newPassword1: string;
  newPassword2: string;
}

export interface SetPasswordByStaffRequestDto {
  newPassword1: string;
  newPassword2: string;
}

export interface AlterPasswordResponseDto {
  changed: boolean;
}

export interface RoleHistoryResponseDto {
  id?: number;
  version?: number;
  role: PersonRole;
  startDate: string;
  endDate: string | null;
  primaryRole?: boolean;
  endJustification?: string | null;
  personId?: number;
}

export interface ProfileDataResponseDto {
  person: PersonResponseDto;
  temporalHistory: RoleHistoryResponseDto[];
}

export interface MedalCountResponseDto {
  gold: number;
  silver: number;
  bronze: number;
}

export interface ProfileStatisticsResponseDto {
  medals: MedalCountResponseDto;
  averageTrainings: string;
  totalTrainingEvaluations: number;
  averageEvents: string;
  totalEventEvaluations: number;
  presentCount: number;
  absentCount: number;
  trainingParticipations: number;
  eventParticipations: number;
  freeTrainingParticipations: number;
}

export interface PersonRoleItem {
  id: number;
  version: number;
  role: PersonRole;
  startDate: string;
  endDate: string | null;
  primaryRole: boolean;
  endJustification: string | null;
  personId: number;
}

export interface RoleHistoryItem {
  id: number;
  version: number;
  role: PersonRole;
  startDate: string;
  endDate: string | null;
  primaryRole: boolean;
  endJustification: string | null;
  personId: number;
}

export interface Person {
  id: number;
  version: number;
  name: string;
  gender: Gender;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  entryDate: string;
  active: boolean;
  activeRoles: PersonRoleItem[];
}

export interface ProfileData {
  person: Person;
  temporalHistory: RoleHistoryItem[];
}

export interface MedalCount {
  gold: number;
  silver: number;
  bronze: number;
}

export interface ProfileStatistics {
  medals: MedalCount;
  averageTrainings: string;
  totalTrainingEvaluations: number;
  averageEvents: string;
  totalEventEvaluations: number;
  presentCount: number;
  absentCount: number;
  trainingParticipations: number;
  eventParticipations: number;
  freeTrainingParticipations: number;
}

export interface PersonFilterValues {
  role: PersonRole | "ALL";
  active: PersonActiveFilter;
  personNameOrEmail: string;
}

export interface CreatePersonFormValues {
  name: string;
  gender: Gender;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  entryDate: string;
  active: boolean;
}

export interface UpdatePersonFormValues {
  name: string;
  gender: Gender;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  entryDate: string;
  active: boolean;
}

export interface AssignRoleFormValues {
  role: PersonRole;
  startDate: string;
  primaryRole: boolean;
}

export interface TerminateRoleFormValues {
  endJustification: string;
}

export interface ChangeOwnPasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordFormValues {
  newPassword: string;
  confirmNewPassword: string;
}