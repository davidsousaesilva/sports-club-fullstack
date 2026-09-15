package com.sportsclub.teams.application;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.sportsclub.security.user.AuthenticatedUser;
import com.sportsclub.teams.domain.enums.TeamRelation;
import com.sportsclub.teams.repository.TeamMemberRepository;

@Service("ss3AuthorizationService")
public class SS3AuthorizationService {

    private final TeamMemberRepository teamMemberRepository;

    public SS3AuthorizationService(TeamMemberRepository teamMemberRepository) {
        this.teamMemberRepository = teamMemberRepository;
    }

    public boolean isActiveTeamMember(Authentication authentication, Integer teamId, LocalDateTime at) {
        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            return false;
        }

        if (teamId == null) {
            return false;
        }

        LocalDateTime effectiveAt = at != null ? at : LocalDateTime.now();

        return teamMemberRepository.existsActiveMembershipAt(
                teamId,
                user.getPersonId(),
                List.of(TeamRelation.ATHLETE, TeamRelation.COACH),
                effectiveAt);
    }
}