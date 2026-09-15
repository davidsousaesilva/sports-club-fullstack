package com.sportsclub.activitytracking.application;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.activities.repository.TrainingRepository;
import com.sportsclub.activitytracking.dto.request.RegisterOrUpdateAttendanceRequest;
import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.security.user.AuthenticatedUser;

import com.sportsclub.teams.domain.enums.TeamRelation;
import com.sportsclub.teams.repository.TeamMemberRepository;

@Service("ss5AuthorizationService")
public class SS5AuthorizationService {

    private final TrainingRepository trainingRepository;
    private final TeamMemberRepository teamMemberRepository;

    public SS5AuthorizationService(
            TrainingRepository trainingRepository,
            TeamMemberRepository teamMemberRepository) {
        this.trainingRepository = trainingRepository;
        this.teamMemberRepository = teamMemberRepository;
    }

    public boolean canRegisterOrUpdateAttendance(
            Authentication authentication,
            RegisterOrUpdateAttendanceRequest request) {

        if (authentication == null) {
            return false;
        }

        if (hasRole(authentication, Role.MANAGER)) {
            return true;
        }

        if (request == null) {
            return false;
        }

        boolean isCoach = hasRole(authentication, Role.COACH);
        boolean isEmployee = hasRole(authentication, Role.EMPLOYEE);

        boolean eventAttendance = request.eventId() != null;
        boolean trainingAttendance = request.trainingId() != null;
        boolean freeTrainingAttendance = trainingAttendance && Boolean.TRUE.equals(request.freeTraining());

        if (eventAttendance) {
            return isCoach;
        }

        if (freeTrainingAttendance) {
            return isEmployee;
        }

        if (trainingAttendance) {
            if (!isCoach) {
                return false;
            }

            Integer personId = extractPersonId(authentication);
            if (personId == null) {
                return false;
            }

            Training training = trainingRepository.findById(request.trainingId()).orElse(null);
            if (training == null || training.getTeam() == null || training.getTeam().getId() == null) {
                return false;
            }

            return teamMemberRepository.existsActiveMembershipAt(
                    training.getTeam().getId(),
                    personId,
                    TeamRelation.COACH,
                    training.getDate());
        }

        return false;
    }

    private boolean hasRole(Authentication authentication, Role role) {
        String authority = role.name();
        String springAuthority = "ROLE_" + role.name();

        return authentication.getAuthorities().stream()
                .anyMatch(a ->
                        a.getAuthority().equals(authority)
                                || a.getAuthority().equals(springAuthority));
    }

    private Integer extractPersonId(Authentication authentication) {
        if (authentication.getPrincipal() instanceof AuthenticatedUser user) {
            return user.getPersonId();
        }
        return null;
    }
}