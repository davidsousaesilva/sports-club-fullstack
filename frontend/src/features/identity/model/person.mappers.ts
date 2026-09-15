import type {
  AlterPasswordRequestDto,
  AssignRoleFormValues,
  AssignRoleRequestDto,
  ChangeOwnPasswordFormValues,
  CreatePersonFormValues,
  CreatePersonRequestDto,
  MedalCount,
  MedalCountResponseDto,
  Person,
  PersonResponseDto,
  PersonRoleItem,
  PersonRoleResponseDto,
  ProfileData,
  ProfileDataResponseDto,
  ProfileStatistics,
  ProfileStatisticsResponseDto,
  ResetPasswordFormValues,
  RoleHistoryItem,
  RoleHistoryResponseDto,
  SetPasswordByStaffRequestDto,
  TerminateRoleFormValues,
  TerminateRoleRequestDto,
  UpdatePersonFormValues,
  UpdatePersonRequestDto,
} from "./person.types";

function mapPersonRole(dto: PersonRoleResponseDto): PersonRoleItem {
  return {
    id: dto.id,
    version: dto.version,
    role: dto.role,
    startDate: dto.startDate,
    endDate: dto.endDate,
    primaryRole: dto.primaryRole,
    endJustification: dto.endJustification,
    personId: dto.personId,
  };
}

function mapRoleHistory(
  dto: RoleHistoryResponseDto,
  index: number,
  personId: number,
): RoleHistoryItem {
  return {
    id: dto.id ?? -(index + 1),
    version: dto.version ?? 0,
    role: dto.role,
    startDate: dto.startDate,
    endDate: dto.endDate,
    primaryRole: dto.primaryRole ?? false,
    endJustification: dto.endJustification ?? null,
    personId: dto.personId ?? personId,
  };
}

function mapPerson(dto: PersonResponseDto): Person {
  return {
    id: dto.id,
    version: dto.version,
    name: dto.name,
    gender: dto.gender,
    email: dto.email,
    phone: dto.phone ?? "",
    address: dto.address ?? "",
    birthDate: dto.birthDate,
    entryDate: dto.entryDate,
    active: dto.active,
    activeRoles: (dto.activeRoles ?? []).map(mapPersonRole),
  };
}

function mapProfileData(dto: ProfileDataResponseDto): ProfileData {
  const person = mapPerson(dto.person);

  const roleHistory = dto.person.roleHistory ?? dto.temporalHistory ?? [];

  return {
    person,
    temporalHistory: roleHistory.map((role, index) =>
      mapRoleHistory(role, index, person.id),
    ),
  };
}

function mapMedalCount(dto: MedalCountResponseDto): MedalCount {
  return {
    gold: dto.gold,
    silver: dto.silver,
    bronze: dto.bronze,
  };
}

function mapProfileStatistics(
  dto: ProfileStatisticsResponseDto,
): ProfileStatistics {
  return {
    medals: mapMedalCount(dto.medals),
    averageTrainings: dto.averageTrainings,
    totalTrainingEvaluations: dto.totalTrainingEvaluations,
    averageEvents: dto.averageEvents,
    totalEventEvaluations: dto.totalEventEvaluations,
    presentCount: dto.presentCount,
    absentCount: dto.absentCount,
    trainingParticipations: dto.trainingParticipations,
    eventParticipations: dto.eventParticipations,
    freeTrainingParticipations: dto.freeTrainingParticipations,
  };
}

function mapCreatePersonRequest(
  values: CreatePersonFormValues,
): CreatePersonRequestDto {
  return {
    name: values.name.trim(),
    gender: values.gender,
    email: values.email.trim(),
    phone: values.phone.trim(),
    address: values.address.trim(),
    birthDate: values.birthDate,
    entryDate: values.entryDate,
    active: values.active,
  };
}

function mapUpdatePersonRequest(
  values: UpdatePersonFormValues,
  version: number,
): UpdatePersonRequestDto {
  return {
    version,
    name: values.name.trim(),
    gender: values.gender,
    email: values.email.trim(),
    phone: values.phone.trim() || null,
    address: values.address.trim() || null,
    birthDate: values.birthDate,
    entryDate: values.entryDate,
    active: values.active,
  };
}

function mapAssignRoleRequest(
  values: AssignRoleFormValues,
): AssignRoleRequestDto {
  return {
    role: values.role,
    startDate: values.startDate,
    endDate: null,
    primaryRole: values.primaryRole,
    endJustification: null,
  };
}

function mapTerminateRoleRequest(
  values: TerminateRoleFormValues,
  version: number,
): TerminateRoleRequestDto {
  return {
    version,
    endJustification: values.endJustification.trim(),
  };
}

function mapAlterPasswordRequest(
  values: ChangeOwnPasswordFormValues,
): AlterPasswordRequestDto {
  return {
    currentPassword: values.currentPassword,
    newPassword1: values.newPassword,
    newPassword2: values.confirmNewPassword,
  };
}

function mapSetPasswordByStaffRequest(
  values: ResetPasswordFormValues,
): SetPasswordByStaffRequestDto {
  return {
    newPassword1: values.newPassword,
    newPassword2: values.confirmNewPassword,
  };
}

export {
  mapPerson,
  mapProfileData,
  mapProfileStatistics,
  mapCreatePersonRequest,
  mapUpdatePersonRequest,
  mapAssignRoleRequest,
  mapTerminateRoleRequest,
  mapAlterPasswordRequest,
  mapSetPasswordByStaffRequest,
};