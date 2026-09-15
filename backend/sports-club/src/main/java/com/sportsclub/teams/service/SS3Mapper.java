package com.sportsclub.teams.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Component;

import com.sportsclub.teams.domain.entities.Team;
import com.sportsclub.teams.domain.entities.TeamMember;
import com.sportsclub.teams.dto.response.TeamMemberResponse;
import com.sportsclub.teams.dto.response.TeamResponse;
import com.sportsclub.teams.dto.response.TeamSummaryResponse;

@Component
public class SS3Mapper {

    public TeamSummaryResponse toTeamSummaryResponse(Team team) {
        LocalDateTime now = LocalDateTime.now();

        return new TeamSummaryResponse(
            team.getId(),
            team.getVersion(),
            team.getName(),
            team.getTeamType(),
            team.getSeasonYear(),
            team.isActive(),
            team.getModality().getId(),
            team.getModality().getName(),
            team.getAthletesActiveAt(now).size(),
            team.getCoachesActiveAt(now).size());
    }

    public TeamResponse toTeamResponse(Team team) {
        List<TeamMemberResponse> members = team.getMembers().stream()
                .map(this::toTeamMemberResponse)
                .toList();

        return new TeamResponse(
            team.getId(),
            team.getVersion(),
            team.getName(),
            team.getTeamType(),
            team.getSeasonYear(),
            team.isActive(),
            team.getModality().getId(),
            team.getModality().getName(),
            members);
    }

    public TeamMemberResponse toTeamMemberResponse(TeamMember teamMember) {
        return new TeamMemberResponse(
            teamMember.getId(),
            teamMember.getVersion(),
            teamMember.getTeam().getId(),
            teamMember.getTeam().getName(),
            teamMember.getPerson().getId(),
            teamMember.getPerson().getName(),
            teamMember.getRelationship(),
            teamMember.getStartDate(),
            teamMember.getEndDate());
    }
}