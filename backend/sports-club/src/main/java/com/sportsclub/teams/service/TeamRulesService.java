package com.sportsclub.teams.service;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.teams.domain.enums.TeamRelation;
import com.sportsclub.teams.repository.TeamMemberRepository;
import com.sportsclub.teams.repository.TeamRepository;

@Service
public class TeamRulesService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;

    public TeamRulesService(
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    public void validateUniqueTeam(Integer teamId, String name, String seasonYear, Integer modalityId) {
        boolean exists = teamId == null
                ? teamRepository.existsByNameIgnoreCaseAndSeasonYearAndModalityId(name, seasonYear, modalityId)
                : teamRepository.existsByNameIgnoreCaseAndSeasonYearAndModalityIdAndIdNot(
                        name,
                        seasonYear,
                        modalityId,
                        teamId);

        if (exists) {
            throw new IllegalStateException("A team with the same name, season and modality already exists.");
        }
    }

    public void ensureNoActiveMembership(Integer teamId, Integer personId, TeamRelation relation) {
        if (teamMemberRepository.existsByTeamIdAndPersonIdAndRelationshipAndEndDateIsNull(teamId, personId, relation)) {
            throw new IllegalStateException(
                    "There is already an active membership with the same relation for this person in this team.");
        }
    }

    public void ensurePersonHasRole(Person person, Role role) {
        if (!person.hasActiveRole(role, LocalDate.now())) {
            throw new IllegalStateException("Person does not have the required active role: " + role);
        }
    }
}