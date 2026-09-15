import type { Person, PersonRole } from "../../identity/model/person.types";

export type TeamType = "INDIVIDUAL" | "TEAM";
export type TeamRelation = "COACH" | "ATHLETE";
export type TeamActiveFilter = "ALL" | "ACTIVE" | "INACTIVE";

export interface TeamSummaryResponseDto {
  id: number;
  version: number;
  name: string;
  teamType: TeamType;
  seasonYear: string;
  active: boolean;
  modalityId: number;
  modalityName: string;
  athleteCount: number;
  coachCount: number;
}

export interface TeamMemberResponseDto {
  id: number;
  version: number;
  teamId: number;
  teamName: string;
  personId: number;
  personName: string;
  relationship: TeamRelation;
  startDate: string;
  endDate: string | null;
}

export interface TeamResponseDto {
  id: number;
  version: number;
  name: string;
  teamType: TeamType;
  seasonYear: string;
  active: boolean;
  modalityId: number;
  modalityName: string;
  members: TeamMemberResponseDto[];
}

export interface CreateTeamRequestDto {
  name: string;
  teamType: TeamType;
  seasonYear: string;
  active: boolean;
  modalityId: number;
}

export interface UpdateTeamRequestDto {
  version: number;
  name: string;
  teamType: TeamType;
  seasonYear: string;
  active: boolean;
  modalityId: number;
}

export interface AddTeamMemberRequestDto {
  personId: number;
  startDate: string;
}

export interface EndMembershipRequestDto {
  version: number;
  endDate: string;
}

export interface TeamMember {
  id: number;
  version: number;
  teamId: number;
  teamName: string;
  personId: number;
  personName: string;
  relationship: TeamRelation;
  startDate: string;
  endDate: string | null;
}

export interface TeamSummary {
  id: number;
  version: number;
  name: string;
  teamType: TeamType;
  seasonYear: string;
  active: boolean;
  modalityId: number;
  modalityName: string;
  athleteCount: number;
  coachCount: number;
}

export interface Team extends TeamSummary {
  members: TeamMember[];
}

export interface TeamFilterValues {
  modalityId?: number;
  teamType: TeamType | "ALL";
  active: TeamActiveFilter;
  teamOrModalityName: string;
  freeTrainingEligible?: boolean;
}

export interface TeamFormValues {
  name: string;
  teamType: TeamType;
  seasonYear: string;
  active: boolean;
  modalityId: number;
}

export interface AddTeamMemberFormValues {
  personId: number;
  startDate: string;
}

export interface EndMembershipFormValues {
  endDate: string;
}

export interface TeamStats {
  totalTeams: number;
  activeTeams: number;
  inactiveTeams: number;
}

export interface TeamRoleCandidate
  extends Pick<Person, "id" | "name" | "email"> {
  activeRoles: PersonRole[];
}

export interface TeamModalityOption {
  id: number;
  name: string;
}