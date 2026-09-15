package com.sportsclub.teams.application;

import java.time.LocalDateTime;
import java.util.List;

import com.sportsclub.teams.dto.filter.TeamFilter;
import com.sportsclub.teams.dto.request.AddTeamMemberRequest;
import com.sportsclub.teams.dto.request.CreateTeamRequest;
import com.sportsclub.teams.dto.request.EndMembershipRequest;
import com.sportsclub.teams.dto.request.UpdateTeamRequest;
import com.sportsclub.teams.dto.response.TeamMemberResponse;
import com.sportsclub.teams.dto.response.TeamResponse;
import com.sportsclub.teams.dto.response.TeamSummaryResponse;

public interface SS3Facade {

    List<TeamSummaryResponse> listTeams(TeamFilter filter);

    TeamResponse getTeam(Integer teamId);

    List<TeamSummaryResponse> listCoachTeams(Integer coachId, TeamFilter filter);

    List<TeamSummaryResponse> listAthleteTeams(Integer athleteId, TeamFilter filter);

    TeamResponse createTeam(CreateTeamRequest request, Integer performedBy);

    void updateTeam(Integer teamId, UpdateTeamRequest request, Integer performedBy);

    TeamMemberResponse addAthlete(Integer teamId, AddTeamMemberRequest request, Integer performedBy);

    TeamMemberResponse addCoach(Integer teamId, AddTeamMemberRequest request, Integer performedBy);

    List<TeamMemberResponse> listAthletesAt(Integer teamId, LocalDateTime at);

    List<TeamMemberResponse> listCoachesAt(Integer teamId, LocalDateTime at);

    void endMembership(Integer teamMemberId, EndMembershipRequest request, Integer performedBy);
}