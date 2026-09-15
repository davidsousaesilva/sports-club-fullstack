package com.sportsclub.activities.controller;

import java.net.URI;
import java.util.List;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sportsclub.activities.application.SS4Facade;
import com.sportsclub.activities.domain.enums.TemporalStatus;
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
import com.sportsclub.security.util.SecurityUtils;

@RestController
@RequestMapping("/api")
public class SS4Controller {

    private final SS4Facade ss4Facade;

    public SS4Controller(SS4Facade ss4Facade) {
        this.ss4Facade = ss4Facade;
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @GetMapping("/competitions")
    public ResponseEntity<List<CompetitionSummaryResponse>> listCompetitions(
            @RequestParam(required = false) Integer modalityId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String competitionNameOrDescriptionOrModality) {
        CompetitionFilter filter = new CompetitionFilter(modalityId, status, competitionNameOrDescriptionOrModality);
        return ResponseEntity.ok(ss4Facade.listCompetitions(filter));
    }

    @PreAuthorize("hasRole('ATHLETE') and #athleteId == authentication.principal.personId")
    @GetMapping("/athletes/{athleteId}/competitions")
    public ResponseEntity<List<CompetitionSummaryResponse>> listAthleteCompetitions(
            @PathVariable Integer athleteId,
            @RequestParam(required = false) Integer modalityId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String competitionNameOrDescriptionOrModality) {
        CompetitionFilter filter = new CompetitionFilter(modalityId, status, competitionNameOrDescriptionOrModality);
        return ResponseEntity.ok(ss4Facade.listAthleteCompetitions(filter, athleteId));
    }

    @PreAuthorize("hasRole('COACH') and #coachId == authentication.principal.personId")
    @GetMapping("/coaches/{coachId}/competitions")
    public ResponseEntity<List<CompetitionSummaryResponse>> listCoachCompetitions(
            @PathVariable Integer coachId,
            @RequestParam(required = false) Integer modalityId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String competitionNameOrDescriptionOrModality) {
        CompetitionFilter filter = new CompetitionFilter(modalityId, status, competitionNameOrDescriptionOrModality);
        return ResponseEntity.ok(ss4Facade.listCoachCompetitions(filter, coachId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH') or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessCompetition(authentication, #competitionId))")
    @GetMapping("/competitions/{competitionId}")
    public ResponseEntity<CompetitionResponse> getCompetition(@PathVariable Integer competitionId) {
        return ResponseEntity.ok(ss4Facade.getCompetition(competitionId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @PostMapping("/competitions")
    public ResponseEntity<CompetitionResponse> createCompetition(
            @Valid @RequestBody CreateCompetitionRequest request) {
        CompetitionResponse response = ss4Facade.createCompetition(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @PutMapping("/competitions/{competitionId}")
    public ResponseEntity<Void> updateCompetition(
            @PathVariable Integer competitionId,
            @Valid @RequestBody UpdateCompetitionRequest request) {
        ss4Facade.updateCompetition(competitionId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @DeleteMapping("/competitions/{competitionId}")
    public ResponseEntity<Void> deleteCompetition(@PathVariable Integer competitionId) {
        ss4Facade.deleteCompetition(competitionId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @GetMapping("/competitions/{competitionId}/registration-fee")
    public ResponseEntity<RegistrationFeeResponse> getRegistrationFee(@PathVariable Integer competitionId) {
        return ResponseEntity.ok(ss4Facade.getRegistrationFee(competitionId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH') or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessCompetition(authentication, #competitionId))")
    @GetMapping("/competitions/{competitionId}/teams")
    public ResponseEntity<List<CompetitionTeamResponse>> listCompetitionTeams(@PathVariable Integer competitionId) {
        return ResponseEntity.ok(ss4Facade.listCompetitionTeams(competitionId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @PostMapping("/competitions/{competitionId}/teams")
    public ResponseEntity<CompetitionTeamResponse> enrollTeam(
            @PathVariable Integer competitionId,
            @Valid @RequestBody EnrollTeamRequest request) {
        CompetitionTeamResponse response = ss4Facade.enrollTeam(competitionId, request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath()
                .path("/api/competition-teams/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @DeleteMapping("/competitions/{competitionId}/teams/{teamId}")
    public ResponseEntity<Void> unenrollTeam(
            @PathVariable Integer competitionId,
            @PathVariable Integer teamId) {
        ss4Facade.unenrollTeam(competitionId, teamId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @PutMapping("/competition-teams/{competitionTeamId}")
    public ResponseEntity<Void> updateCompetitionTeam(
            @PathVariable Integer competitionTeamId,
            @Valid @RequestBody UpdateCompetitionTeamRequest request) {
        ss4Facade.updateCompetitionTeam(competitionTeamId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @GetMapping("/events")
    public ResponseEntity<List<EventSummaryResponse>> listEvents(
            @RequestParam(required = false) Integer competitionId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String eventNameOrDescriptionOrCompetition) {

        EventFilter filter = new EventFilter(
                competitionId,
                status,
                eventNameOrDescriptionOrCompetition);

        return ResponseEntity.ok(ss4Facade.listEvents(filter));
    }

    @PreAuthorize("hasRole('ATHLETE') and #athleteId == authentication.principal.personId")
    @GetMapping("/athletes/{athleteId}/events")
    public ResponseEntity<List<EventSummaryResponse>> listAthleteEvents(
            @PathVariable Integer athleteId,
            @RequestParam(required = false) Integer competitionId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String eventNameOrDescriptionOrCompetition) {

        EventFilter filter = new EventFilter(
                competitionId,
                status,
                eventNameOrDescriptionOrCompetition);

        return ResponseEntity.ok(ss4Facade.listAthleteEvents(filter, athleteId));
    }

    @PreAuthorize("hasRole('COACH') and #coachId == authentication.principal.personId")
    @GetMapping("/coaches/{coachId}/events")
    public ResponseEntity<List<EventSummaryResponse>> listCoachEvents(
            @PathVariable Integer coachId,
            @RequestParam(required = false) Integer competitionId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String eventNameOrDescriptionOrCompetition) {
        EventFilter filter = new EventFilter(
                    competitionId,
                    status,
                    eventNameOrDescriptionOrCompetition);
        return ResponseEntity.ok(ss4Facade.listCoachEvents(filter, coachId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH') or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessCompetition(authentication, #competitionId))")
    @GetMapping("/competitions/{competitionId}/events")
    public ResponseEntity<List<EventSummaryResponse>> listCompetitionEvents(@PathVariable Integer competitionId) {
        return ResponseEntity.ok(ss4Facade.listCompetitionEvents(competitionId));
    }

    @PreAuthorize("""
                hasRole('MANAGER')
                or (hasRole('COACH') and @ss4AuthorizationService.canAccessEventAsCoach(authentication, #eventId))
                or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessEventAsAthlete(authentication, #eventId))
            """)
    @GetMapping("/events/{eventId}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Integer eventId) {
        return ResponseEntity.ok(ss4Facade.getEvent(eventId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @PostMapping("/events")
    public ResponseEntity<EventResponse> createEvent(
            @Valid @RequestBody CreateEventRequest request) {
        EventResponse response = ss4Facade.createEvent(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @PutMapping("/events/{eventId}")
    public ResponseEntity<Void> updateEvent(
            @PathVariable Integer eventId,
            @Valid @RequestBody UpdateEventRequest request) {
        ss4Facade.updateEvent(eventId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @DeleteMapping("/events/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Integer eventId) {
        ss4Facade.deleteEvent(eventId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @PutMapping("/event-teams/{eventTeamId}")
    public ResponseEntity<Void> updateEventTeam(
            @PathVariable Integer eventTeamId,
            @Valid @RequestBody UpdateEventTeamRequest request) {
        ss4Facade.updateEventTeam(eventTeamId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/trainings")
    public ResponseEntity<List<TrainingSummaryResponse>> listTrainings(
            @RequestParam(required = false) Integer teamId,
            @RequestParam(required = false) Integer complexId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String trainingDescriptionOrTeam) {
        TrainingFilter filter = new TrainingFilter(teamId, complexId, status, trainingDescriptionOrTeam);
        return ResponseEntity.ok(ss4Facade.listTrainings(filter));
    }

    @PreAuthorize("hasRole('MANAGER') or (hasRole('ATHLETE') and #athleteId == authentication.principal.personId)")
    @GetMapping("/athletes/{athleteId}/trainings")
    public ResponseEntity<List<TrainingSummaryResponse>> listAthleteTrainings(
            @PathVariable Integer athleteId, 
            @RequestParam(required = false) Integer teamId,
            @RequestParam(required = false) Integer complexId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String trainingDescriptionOrTeam) {
        TrainingFilter filter = new TrainingFilter(teamId, complexId, status, trainingDescriptionOrTeam);
        return ResponseEntity.ok(ss4Facade.listAthleteTrainings(filter, athleteId));
    }

    @PreAuthorize("hasRole('MANAGER') or (hasRole('COACH') and #coachId == authentication.principal.personId)")
    @GetMapping("/coaches/{coachId}/trainings")
    public ResponseEntity<List<TrainingSummaryResponse>> listCoachTrainings(
            @PathVariable Integer coachId,
            @RequestParam(required = false) Integer teamId,
            @RequestParam(required = false) Integer complexId,
            @RequestParam(required = false) TemporalStatus status,
            @RequestParam(required = false) String trainingDescriptionOrTeam) {
        TrainingFilter filter = new TrainingFilter(teamId, complexId, status, trainingDescriptionOrTeam);
        return ResponseEntity.ok(ss4Facade.listCoachTrainings(filter, coachId));
    }

    @PreAuthorize("""
                hasRole('MANAGER')
                or (hasRole('COACH') and @ss4AuthorizationService.canAccessTrainingAsCoach(authentication, #trainingId))
                or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessTrainingAsAthlete(authentication, #trainingId))
            """)
    @GetMapping("/trainings/{trainingId}")
    public ResponseEntity<TrainingResponse> getTraining(@PathVariable Integer trainingId) {
        return ResponseEntity.ok(ss4Facade.getTraining(trainingId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','COACH')")
    @PostMapping("/trainings")
    public ResponseEntity<TrainingResponse> createTraining(
            @Valid @RequestBody CreateTrainingRequest request) {
        TrainingResponse response = ss4Facade.createTraining(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("""
                hasRole('MANAGER')
                or (hasRole('COACH') and @ss4AuthorizationService.canAccessTrainingAsCoach(authentication, #trainingId))
            """)
    @PutMapping("/trainings/{trainingId}")
    public ResponseEntity<Void> updateTraining(
            @PathVariable Integer trainingId,
            @Valid @RequestBody UpdateTrainingRequest request) {
        ss4Facade.updateTraining(trainingId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("""
                hasRole('MANAGER')
                or (hasRole('COACH') and @ss4AuthorizationService.canAccessTrainingAsCoach(authentication, #trainingId))
            """)
    @DeleteMapping("/trainings/{trainingId}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Integer trainingId) {
        ss4Facade.deleteTraining(trainingId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    private Integer getAuthenticatedPersonId() {
        return SecurityUtils.getAuthenticatedPersonId();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/events/{eventId}/teams")
    public ResponseEntity<List<EventTeamResponse>> listTeamsByEvent(
            @PathVariable Integer eventId) {
        return ResponseEntity.ok(ss4Facade.listTeamsByEvent(eventId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/events/{eventId}/teams")
    public ResponseEntity<EventTeamResponse> addTeamToEvent(
            @PathVariable Integer eventId,
            @Valid @RequestBody EnrollTeamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ss4Facade.addTeamToEvent(
                        eventId,
                        request,
                        SecurityUtils.getAuthenticatedPersonId()));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @DeleteMapping("/events/{eventId}/teams/{teamId}")
    public ResponseEntity<Void> removeTeamFromEvent(
            @PathVariable Integer eventId,
            @PathVariable Integer teamId) {
        ss4Facade.removeTeamFromEvent(
                eventId,
                teamId,
                SecurityUtils.getAuthenticatedPersonId());

        return ResponseEntity.noContent().build();
    }
}