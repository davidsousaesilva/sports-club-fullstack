import { httpClient } from "../../../lib/api/http-client";
import {
  mapCreatePersonRequest,
  mapPerson,
  mapProfileData,
  mapProfileStatistics,
} from "../model/person.mappers";
import type {
  AlterPasswordResponseDto,
  AssignRoleRequestDto,
  CreatePersonFormValues,
  PersonFilterValues,
  PersonResponseDto,
  PersonRoleResponseDto,
  ProfileDataResponseDto,
  ProfileStatistics,
  ProfileStatisticsResponseDto,
  SetPasswordByStaffRequestDto,
  TerminateRoleRequestDto,
  UpdatePersonRequestDto,
} from "../model/person.types";

function buildQueryString(
  params: Record<string, string | boolean | undefined>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
}

function buildPeopleQueryParams(
  filters: PersonFilterValues,
): Record<string, string | boolean | undefined> {
  return {
    role: filters.role === "ALL" ? undefined : filters.role,
    active: filters.active === "ALL" ? undefined : filters.active === "ACTIVE",
    personNameOrEmail: filters.personNameOrEmail.trim() || undefined,
  };
}

async function listPeople(filters: PersonFilterValues) {
  const response = await httpClient.get<PersonResponseDto[]>(
    `api/people${buildQueryString(buildPeopleQueryParams(filters))}`,
  );

  return response.map(mapPerson);
}

async function createPerson(values: CreatePersonFormValues) {
  const payload = mapCreatePersonRequest(values);

  const createdPerson = await httpClient.post<PersonResponseDto>(
    "api/people",
    payload,
  );

  return mapPerson(createdPerson);
}

async function getProfile(personId: number) {
  const response = await httpClient.get<ProfileDataResponseDto>(
    `api/profile/${personId}`,
  );

  return mapProfileData(response);
}

async function getProfileStatistics(
  personId: number,
): Promise<ProfileStatistics> {
  const response = await httpClient.get<ProfileStatisticsResponseDto>(
    `api/profile/${personId}/statistics`,
  );

  return mapProfileStatistics(response);
}

async function updatePerson(personId: number, payload: UpdatePersonRequestDto) {
  await httpClient.put(`api/people/${personId}`, payload);
}

async function alterPassword(
  personId: number,
  payload: {
    currentPassword: string;
    newPassword1: string;
    newPassword2: string;
  },
) {
  return httpClient.post<AlterPasswordResponseDto>(
    `api/people/${personId}/password`,
    payload,
  );
}

async function setPasswordByStaff(
  personId: number,
  payload: SetPasswordByStaffRequestDto,
) {
  await httpClient.post(`api/people/${personId}/password/reset`, payload);
}

async function assignRole(personId: number, payload: AssignRoleRequestDto) {
  return httpClient.post<PersonRoleResponseDto>(
    `api/people/${personId}/roles`,
    payload,
  );
}

async function terminateRole(
  personRoleId: number,
  payload: TerminateRoleRequestDto,
) {
  await httpClient.post(
    `api/person-roles/${personRoleId}/termination`,
    payload,
  );
}

async function makeRolePrimary(personRoleId: number) {
  await httpClient.post(`api/person-roles/${personRoleId}/primary`);
}

export {
  createPerson,
  listPeople,
  getProfile,
  getProfileStatistics,
  updatePerson,
  alterPassword,
  setPasswordByStaff,
  assignRole,
  terminateRole,
  makeRolePrimary,
};
