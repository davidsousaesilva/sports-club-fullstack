package com.sportsclub.activities.application;

import java.util.List;

import com.sportsclub.activities.dto.filter.CompetitionFilter;
import com.sportsclub.activities.dto.filter.EventFilter;
import com.sportsclub.activities.dto.filter.TrainingFilter;
import com.sportsclub.activities.dto.request.CreateCompetitionRequest;
import com.sportsclub.activities.dto.request.CreateEventRequest;
import com.sportsclub.activities.dto.request.CreateTrainingRequest;
import com.sportsclub.activities.dto.request.EnrollTeamRequest;
import com.sportsclub.activities.dto.request.UpdateCompetitionRequest;
import com.sportsclub.activities.dto.request.UpdateCompetitionTeamRequest;
import com.sportsclub.activities.dto.request.UpdateEventRequest;
import com.sportsclub.activities.dto.request.UpdateEventTeamRequest;
import com.sportsclub.activities.dto.request.UpdateTrainingRequest;
import com.sportsclub.activities.dto.response.CompetitionResponse;
import com.sportsclub.activities.dto.response.CompetitionSummaryResponse;
import com.sportsclub.activities.dto.response.CompetitionTeamResponse;
import com.sportsclub.activities.dto.response.EventResponse;
import com.sportsclub.activities.dto.response.EventSummaryResponse;
import com.sportsclub.activities.dto.response.EventTeamResponse;
import com.sportsclub.activities.dto.response.RegistrationFeeResponse;
import com.sportsclub.activities.dto.response.TrainingResponse;
import com.sportsclub.activities.dto.response.TrainingSummaryResponse;

public interface SS4Facade {

    List<CompetitionSummaryResponse> listCompetitions(CompetitionFilter filter);

    List<CompetitionSummaryResponse> listAthleteCompetitions(CompetitionFilter filter, Integer athleteId);

    List<CompetitionSummaryResponse> listCoachCompetitions(CompetitionFilter filter, Integer coachId);

    CompetitionResponse getCompetition(Integer competitionId);

    CompetitionResponse createCompetition(CreateCompetitionRequest request, Integer performedBy);

    void updateCompetition(Integer competitionId, UpdateCompetitionRequest request, Integer performedBy);

    void deleteCompetition(Integer competitionId, Integer performedBy);

    RegistrationFeeResponse getRegistrationFee(Integer competitionId);

    List<CompetitionTeamResponse> listCompetitionTeams(Integer competitionId);

    CompetitionTeamResponse enrollTeam(Integer competitionId, EnrollTeamRequest request, Integer performedBy);

    void unenrollTeam(Integer competitionId, Integer teamId, Integer performedBy);

    void updateCompetitionTeam(Integer competitionTeamId, UpdateCompetitionTeamRequest request, Integer performedBy);

    List<EventSummaryResponse> listEvents(EventFilter filter);

    List<EventSummaryResponse> listAthleteEvents(EventFilter filter, Integer athleteId);

    List<EventSummaryResponse> listCoachEvents(EventFilter filter, Integer coachId);

    List<EventSummaryResponse> listCompetitionEvents(Integer competitionId);

    EventResponse getEvent(Integer eventId);

    EventResponse createEvent(CreateEventRequest request, Integer performedBy);

    void updateEvent(Integer eventId, UpdateEventRequest request, Integer performedBy);

    void deleteEvent(Integer eventId, Integer performedBy);

    void updateEventTeam(Integer eventTeamId, UpdateEventTeamRequest request, Integer performedBy);

    List<TrainingSummaryResponse> listTrainings(TrainingFilter filter);

    List<TrainingSummaryResponse> listAthleteTrainings(TrainingFilter filter, Integer athleteId);

    List<TrainingSummaryResponse> listCoachTrainings(TrainingFilter filter, Integer coachId);

    TrainingResponse getTraining(Integer trainingId);

    TrainingResponse createTraining(CreateTrainingRequest request, Integer performedBy);

    void updateTraining(Integer trainingId, UpdateTrainingRequest request, Integer performedBy);

    void deleteTraining(Integer trainingId, Integer performedBy);

    List<EventTeamResponse> listTeamsByEvent(Integer eventId);

    EventTeamResponse addTeamToEvent(Integer eventId, EnrollTeamRequest request, Integer performedBy);

    void removeTeamFromEvent(Integer eventId, Integer teamId, Integer performedBy);
}