package com.sportsclub.teams.controller;

import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sportsclub.security.util.SecurityUtils;
import com.sportsclub.teams.application.SS3Facade;
import com.sportsclub.teams.domain.enums.TeamType;
import com.sportsclub.teams.dto.filter.TeamFilter;
import com.sportsclub.teams.dto.request.AddTeamMemberRequest;
import com.sportsclub.teams.dto.request.CreateTeamRequest;
import com.sportsclub.teams.dto.request.EndMembershipRequest;
import com.sportsclub.teams.dto.request.UpdateTeamRequest;
import com.sportsclub.teams.dto.response.TeamMemberResponse;
import com.sportsclub.teams.dto.response.TeamResponse;
import com.sportsclub.teams.dto.response.TeamSummaryResponse;

@RestController
@RequestMapping("/api")
public class SS3Controller {

    private final SS3Facade ss3Facade;

    public SS3Controller(SS3Facade ss3Facade) {
        this.ss3Facade = ss3Facade;
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/teams")
    public ResponseEntity<List<TeamSummaryResponse>> listTeams(
            @RequestParam(required = false) Integer idModality,
            @RequestParam(required = false) TeamType teamType,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String teamOrModalityName,
            @RequestParam(required = false) Boolean freeTrainingEligible) {

        TeamFilter filter = new TeamFilter(
                idModality,
                teamType,
                active,
                teamOrModalityName,
                freeTrainingEligible);

        return ResponseEntity.ok(ss3Facade.listTeams(filter));
    }

    @PreAuthorize("""
            hasAnyRole('MANAGER','EMPLOYEE')
            or (
                hasRole('COACH')
                and @ss3AuthorizationService.isActiveTeamMember(authentication, #teamId, null)
            )
            """)
    @GetMapping("/teams/{teamId}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable Integer teamId) {
        return ResponseEntity.ok(ss3Facade.getTeam(teamId));
    }

    @PreAuthorize("(hasRole('COACH') and #coachId == authentication.principal.personId) or hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/coaches/{coachId}/teams")
    public ResponseEntity<List<TeamSummaryResponse>> listCoachTeams(
            @PathVariable Integer coachId,
            @RequestParam(required = false) Integer idModality,
            @RequestParam(required = false) TeamType teamType,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String teamOrModalityName) {

        TeamFilter filter = new TeamFilter(
                idModality,
                teamType,
                active,
                teamOrModalityName,
               null);
        
        return ResponseEntity.ok(ss3Facade.listCoachTeams(coachId, filter));
    }

    @PreAuthorize("(hasRole('ATHLETE') and #athleteId == authentication.principal.personId) or hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/athletes/{athleteId}/teams")
    public ResponseEntity<List<TeamSummaryResponse>> listAthleteTeams(
            @PathVariable Integer athleteId,
            @RequestParam(required = false) Integer idModality,
            @RequestParam(required = false) TeamType teamType,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String teamOrModalityName) {

        TeamFilter filter = new TeamFilter(
                idModality,
                teamType,
                active,
                teamOrModalityName,
                null);

        return ResponseEntity.ok(ss3Facade.listAthleteTeams(athleteId, filter));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/teams")
    public ResponseEntity<TeamResponse> createTeam(@Valid @RequestBody CreateTeamRequest request) {
        TeamResponse response = ss3Facade.createTeam(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PutMapping("/teams/{teamId}")
    public ResponseEntity<Void> updateTeam(
            @PathVariable Integer teamId,
            @Valid @RequestBody UpdateTeamRequest request) {

        ss3Facade.updateTeam(teamId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/teams/{teamId}/athletes")
    public ResponseEntity<TeamMemberResponse> addAthlete(
            @PathVariable Integer teamId,
            @Valid @RequestBody AddTeamMemberRequest request) {

        TeamMemberResponse response = ss3Facade.addAthlete(teamId, request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/teams/{teamId}/coaches")
    public ResponseEntity<TeamMemberResponse> addCoach(
            @PathVariable Integer teamId,
            @Valid @RequestBody AddTeamMemberRequest request) {

        TeamMemberResponse response = ss3Facade.addCoach(teamId, request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or @ss3AuthorizationService.isActiveTeamMember(authentication, #teamId, #at)")
    @GetMapping("/teams/{teamId}/athletes")
    public ResponseEntity<List<TeamMemberResponse>> listAthletesAt(
            @PathVariable Integer teamId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime at) {

        return ResponseEntity.ok(ss3Facade.listAthletesAt(teamId, at));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or @ss3AuthorizationService.isActiveTeamMember(authentication, #teamId, #at)")
    @GetMapping("/teams/{teamId}/coaches")
    public ResponseEntity<List<TeamMemberResponse>> listCoachesAt(
            @PathVariable Integer teamId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime at) {

        return ResponseEntity.ok(ss3Facade.listCoachesAt(teamId, at));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/team-members/{teamMemberId}/termination")
    public ResponseEntity<Void> endMembership(
            @PathVariable Integer teamMemberId,
            @Valid @RequestBody EndMembershipRequest request) {

        ss3Facade.endMembership(teamMemberId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    private Integer getAuthenticatedPersonId() {
        return SecurityUtils.getAuthenticatedPersonId();
    }
}