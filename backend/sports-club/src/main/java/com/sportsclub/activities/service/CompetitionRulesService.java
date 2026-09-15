package com.sportsclub.activities.service;

import org.springframework.stereotype.Service;

import com.sportsclub.activities.domain.entities.Competition;
import com.sportsclub.activities.repository.CompetitionTeamRepository;
import com.sportsclub.activities.repository.EventRepository;
import com.sportsclub.teams.domain.entities.Team;

@Service
public class CompetitionRulesService {

    private final CompetitionTeamRepository competitionTeamRepository;
    private final EventRepository eventRepository;

    public CompetitionRulesService(
            CompetitionTeamRepository competitionTeamRepository,
            EventRepository eventRepository) {
        this.competitionTeamRepository = competitionTeamRepository;
        this.eventRepository = eventRepository;
    }

    public void validateDeletion(Integer competitionId) {
        if (!competitionTeamRepository.findByCompetitionIdOrderByIdAsc(competitionId).isEmpty()) {
            throw new IllegalStateException("Competition still has enrolled teams.");
        }

        if (!eventRepository.findByCompetitionIdOrderByDateAsc(competitionId).isEmpty()) {
            throw new IllegalStateException("Competition is still referenced by events.");
        }
    }

    public void validateTeamEnrollment(Integer competitionId, Integer teamId) {
        if (competitionTeamRepository.existsByCompetitionIdAndTeamId(competitionId, teamId)) {
            throw new IllegalStateException("Team is already enrolled in competition.");
        }
    }

    public void ensureTeamModalityMatchesCompetition(Competition competition, Team team) {
        if (competition == null) {
            throw new IllegalArgumentException("Competition cannot be null.");
        }

        if (team == null) {
            throw new IllegalArgumentException("Team cannot be null.");
        }

        Integer competitionModalityId = competition.getModality().getId();
        Integer teamModalityId = team.getModality().getId();

        if (!competitionModalityId.equals(teamModalityId)) {
            throw new IllegalStateException(
                    "Team modality does not match competition modality.");
        }
    }
}