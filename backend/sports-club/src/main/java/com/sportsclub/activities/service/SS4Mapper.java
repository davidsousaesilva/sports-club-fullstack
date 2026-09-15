package com.sportsclub.activities.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.sportsclub.activities.domain.entities.Competition;
import com.sportsclub.activities.domain.entities.CompetitionTeam;
import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.entities.EventTeam;
import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.activities.dto.response.CompetitionResponse;
import com.sportsclub.activities.dto.response.CompetitionSummaryResponse;
import com.sportsclub.activities.dto.response.CompetitionTeamResponse;
import com.sportsclub.activities.dto.response.EventResponse;
import com.sportsclub.activities.dto.response.EventSummaryResponse;
import com.sportsclub.activities.dto.response.EventTeamResponse;
import com.sportsclub.activities.dto.response.RegistrationFeeResponse;
import com.sportsclub.activities.dto.response.TrainingResponse;
import com.sportsclub.activities.dto.response.TrainingSummaryResponse;
import com.sportsclub.teams.dto.response.TeamMemberResponse;
import com.sportsclub.sportscore.domain.entities.StatisticType;
import com.sportsclub.sportscore.dto.response.StatisticTypeResponse;


@Component
public class SS4Mapper {

        public CompetitionResponse toCompetitionResponse(
                        Competition competition,
                        List<CompetitionTeam> teams) {
                return toCompetitionResponse(competition, teams, List.of());
        }

        public CompetitionResponse toCompetitionResponse(
                        Competition competition,
                        List<CompetitionTeam> teams,
                        List<EventSummaryResponse> events) {

                List<CompetitionTeamResponse> registeredTeams = teams.stream()
                                .map(this::toCompetitionTeamResponse)
                                .toList();

                return new CompetitionResponse(
                        competition.getId(),
                        competition.getVersion(),
                        competition.getName(),
                        competition.getDescription(),
                        competition.getStartDate(),
                        competition.getEndDate(),
                        competition.getRegistrationFee(),
                        competition.getModality().getId(),
                        competition.getModality().getName(),
                        registeredTeams,
                        events);
        }

    public CompetitionSummaryResponse toCompetitionSummaryResponse(Competition competition) {
        return toCompetitionSummaryResponse(competition, 0, 0);
    }

    public CompetitionSummaryResponse toCompetitionSummaryResponse(
                        Competition competition,
                        Integer registredTeams,
                    Integer eventCount) {
            return new CompetitionSummaryResponse(
                competition.getId(),
                competition.getVersion(),
                competition.getName(),
                competition.getDescription(),
                competition.getStartDate(),
                competition.getEndDate(),
                competition.getRegistrationFee(),
                competition.getModality().getId(),
                competition.getModality().getName(),
                registredTeams,
                eventCount);
    }

    public CompetitionTeamResponse toCompetitionTeamResponse(CompetitionTeam competitionTeam) {
            return new CompetitionTeamResponse(
                competitionTeam.getId(),
                competitionTeam.getVersion(),
                competitionTeam.getNote(),
                competitionTeam.getFinalResult(),
                competitionTeam.getResultPoints(),
                competitionTeam.getCompetition().getId(),
                competitionTeam.getTeam().getId(),
                competitionTeam.getTeam().getName());
    }
    
    public EventResponse toEventResponse(Event event, List<EventTeam> teams) {
                return toEventResponse(event, teams, Map.of(), List.of());
        }

    public EventResponse toEventResponse(
                        Event event,
                        List<EventTeam> teams,
                        Map<Integer, List<TeamMemberResponse>> members,
                        List<StatisticTypeResponse> statsTypes) {

                List<EventTeamResponse> teamResponses = teams.stream()
                                .map(this::toEventTeamResponse)
                                .toList();

                return new EventResponse(
                        event.getId(),
                        event.getVersion(),
                        event.getDescription(),
                        event.getDate(),
                        event.getDuration(),
                        event.getModality().getId(),
                        event.getModality().getName(),
                        event.getComplex() != null ? event.getComplex().getId() : null,
                        event.getComplex() != null ? event.getComplex().getName() : null,
                        event.getCompetition() != null ? event.getCompetition().getId() : null,
                        event.getCompetition() != null ? event.getCompetition().getName() : null,
                        teamResponses,
                        members,
                        statsTypes);
        }
    
    public EventSummaryResponse toEventSummaryResponse(Event event) {
                return toEventSummaryResponse(event, List.of(), BigDecimal.ZERO, BigDecimal.ZERO);
        }

    public EventSummaryResponse toEventSummaryResponse(
                        Event event,
                        List<EventTeam> teams,
                        BigDecimal presentAthletesPercent,
                        BigDecimal performanceEntriesPercent) {

                List<EventTeamResponse> teamResponses = teams.stream()
                                .map(this::toEventTeamResponse)
                                .toList();

                return new EventSummaryResponse(
                        event.getId(),
                        event.getVersion(),
                        event.getDescription(),
                        event.getDate(),
                        event.getDuration(),
                        event.getModality().getId(),
                        event.getModality().getName(),
                        event.getComplex() != null ? event.getComplex().getId() : null,
                        event.getComplex() != null ? event.getComplex().getName() : null,
                        event.getCompetition() != null ? event.getCompetition().getId() : null,
                        event.getCompetition() != null ? event.getCompetition().getName() : null,
                        teamResponses,
                        presentAthletesPercent,
                        performanceEntriesPercent);
        }

    public EventTeamResponse toEventTeamResponse(EventTeam eventTeam) {
        return new EventTeamResponse(
                eventTeam.getId(),
                eventTeam.getVersion(),
                eventTeam.getResult(),
                eventTeam.getNumericResult(),
                eventTeam.getEvent().getId(),
                eventTeam.getTeam().getId(),
                eventTeam.getTeam().getName());
    }

        public TrainingSummaryResponse toTrainingSummaryResponse(Training training) {
                return toTrainingSummaryResponse(training, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        public TrainingResponse toTrainingResponse(Training training) {
                return toTrainingResponse(training, List.of(), List.of());
        }

    public RegistrationFeeResponse toRegistrationFeeResponse(Competition competition) {
        return new RegistrationFeeResponse(competition.getRegistrationFee());
    }

    public TrainingSummaryResponse toTrainingSummaryResponse(
            Training training,
            BigDecimal presentAthletesPercent,
            BigDecimal performanceEntriesPercent) {
        return new TrainingSummaryResponse(
                training.getId(),
                training.getVersion(),
                training.getDescription(),
                training.getNote(),
                training.getDate(),
                training.getDuration(),
                training.getComplex() != null ? training.getComplex().getId() : null,
                training.getComplex() != null ? training.getComplex().getName() : null,
                training.getTeam().getId(),
                training.getTeam().getName(),
                presentAthletesPercent,
                performanceEntriesPercent);
    }

    public TrainingResponse toTrainingResponse(
            Training training,
            List<TeamMemberResponse> members,
                    List<StatisticTypeResponse> statsTypes) {
            return new TrainingResponse(
                training.getId(),
                training.getVersion(),
                training.getDescription(),
                training.getNote(),
                training.getDate(),
                training.getDuration(),
                training.getComplex() != null ? training.getComplex().getId() : null,
                training.getComplex() != null ? training.getComplex().getName() : null,
                training.getTeam().getId(),
                training.getTeam().getName(),
                members,
                statsTypes);
    }
    
    public StatisticTypeResponse toStatisticTypeResponse(StatisticType statisticType) {
            return new StatisticTypeResponse(
                            statisticType.getId(),
                            statisticType.getVersion(),
                            statisticType.getName(),
                            statisticType.getUnit(),
                            statisticType.isMandatory());
    }
}