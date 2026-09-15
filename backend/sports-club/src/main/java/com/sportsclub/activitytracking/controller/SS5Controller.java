package com.sportsclub.activitytracking.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sportsclub.activitytracking.application.SS5Facade;
import com.sportsclub.activitytracking.dto.request.RegisterOrUpdateAttendanceRequest;
import com.sportsclub.activitytracking.dto.request.RegisterOrUpdatePerformancesRequest;
import com.sportsclub.activitytracking.dto.response.AggregatedPerformanceResponse;
import com.sportsclub.activitytracking.dto.response.AttendanceResponse;
import com.sportsclub.activitytracking.dto.response.AttendanceStatisticsResponse;
import com.sportsclub.security.util.SecurityUtils;

@RestController
@RequestMapping("/api")
public class SS5Controller {

    private final SS5Facade ss5Facade;

    public SS5Controller(SS5Facade ss5Facade) {
        this.ss5Facade = ss5Facade;
    }

    @PreAuthorize("""
                hasRole('MANAGER')
                or (hasRole('COACH') and @ss4AuthorizationService.canAccessTrainingAsCoach(authentication, #trainingId))
                or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessTrainingAsAthlete(authentication, #trainingId))
            """)
    @GetMapping("/trainings/{trainingId}/attendances")
    public ResponseEntity<List<AttendanceResponse>> listTrainingAttendances(@PathVariable Integer trainingId) {
        return ResponseEntity.ok(ss5Facade.listTrainingAttendances(trainingId));
    }

    @PreAuthorize("""
                hasRole('MANAGER')
                or (hasRole('COACH') and @ss4AuthorizationService.canAccessEventAsCoach(authentication, #eventId))
                or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessEventAsAthlete(authentication, #eventId))
            """)
    @GetMapping("/events/{eventId}/attendances")
    public ResponseEntity<List<AttendanceResponse>> listEventAttendances(@PathVariable Integer eventId) {
        return ResponseEntity.ok(ss5Facade.listEventAttendances(eventId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/teams/{teamId}/free-trainings/attendances")
    public ResponseEntity<List<AttendanceResponse>> listWeeklyFreeTrainingAttendances(
            @PathVariable Integer teamId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate on) {

        return ResponseEntity.ok(ss5Facade.listWeeklyFreeTrainingAttendances(teamId, on));
    }

    @PreAuthorize("hasAnyRole('MANAGER') or @ss5AuthorizationService.canRegisterOrUpdateAttendance(authentication, #request)")
    @PostMapping("/attendances")
    public ResponseEntity<AttendanceResponse> registerOrUpdateAttendance(
            @Valid @RequestBody RegisterOrUpdateAttendanceRequest request) {

        AttendanceResponse response = ss5Facade.registerOrUpdateAttendance(request, getAuthenticatedPersonId());

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
                or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessTrainingAsAthlete(authentication, #trainingId))
            """)
    @GetMapping("/trainings/{trainingId}/performances")
    public ResponseEntity<List<AggregatedPerformanceResponse>> listTrainingPerformances(
            @PathVariable Integer trainingId) {
        return ResponseEntity.ok(ss5Facade.listTrainingPerformances(trainingId));
    }

    @PreAuthorize("""
                hasRole('MANAGER')
                or (hasRole('COACH') and @ss4AuthorizationService.canAccessEventAsCoach(authentication, #eventId))
                or (hasRole('ATHLETE') and @ss4AuthorizationService.canAccessEventAsAthlete(authentication, #eventId))
            """)
    @GetMapping("/events/{eventId}/performances")
    public ResponseEntity<List<AggregatedPerformanceResponse>> listEventPerformances(
            @PathVariable Integer eventId) {
        return ResponseEntity.ok(ss5Facade.listEventPerformances(eventId));
    }

    @PreAuthorize("""
            hasRole('MANAGER')
            or (
                hasRole('COACH')
                and (
                    (#request.trainingId != null
                        and @ss4AuthorizationService.canAccessTrainingAsCoach(authentication, #request.trainingId))
                    or
                    (#request.eventId != null
                        and @ss4AuthorizationService.canAccessEventAsCoach(authentication, #request.eventId))
                )
            )
        """)
    @PostMapping("/performances")
    public ResponseEntity<Void> registerOrUpdatePerformances(
            @Valid @RequestBody RegisterOrUpdatePerformancesRequest request) {

        ss5Facade.registerOrUpdatePerformances(request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/statistics/attendances")
    public ResponseEntity<AttendanceStatisticsResponse> calculateAttendanceStatistics() {
        return ResponseEntity.ok(ss5Facade.calculateAttendanceStatistics());
    }

    @PreAuthorize("hasRole('COACH') and #coachId == authentication.principal.personId")
    @GetMapping("/coaches/{coachId}/statistics/attendances")
    public ResponseEntity<AttendanceStatisticsResponse> calculateCoachAttendanceStatistics(
            @PathVariable Integer coachId) {
        return ResponseEntity.ok(ss5Facade.calculateCoachAttendanceStatistics(coachId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/attendances/free-trainings")
    public ResponseEntity<AttendanceResponse> registerOrUpdateFreeTrainingAttendance(
            @Valid @RequestBody RegisterOrUpdateAttendanceRequest request) {

        RegisterOrUpdateAttendanceRequest normalizedRequest = new RegisterOrUpdateAttendanceRequest(
                request.version(),
                request.present(),
                null,
                null,
                request.athleteId(),
                true,
                request.teamId(),
                request.attendanceDate());

        AttendanceResponse response = ss5Facade.registerOrUpdateAttendance(
                normalizedRequest,
                getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromPath("/api/attendances/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    
    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/attendances/free-trainings")
    public ResponseEntity<List<AttendanceResponse>> listFreeTrainingAttendances(
            @RequestParam Integer teamId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return ResponseEntity.ok(
                ss5Facade.listWeeklyFreeTrainingAttendances(teamId, date)
        );
    }

    private Integer getAuthenticatedPersonId() {
        return SecurityUtils.getAuthenticatedPersonId();
    }
}