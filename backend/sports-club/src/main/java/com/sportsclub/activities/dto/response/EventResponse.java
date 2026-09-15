package com.sportsclub.activities.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import com.sportsclub.sportscore.dto.response.StatisticTypeResponse;
import com.sportsclub.teams.dto.response.TeamMemberResponse;

public record EventResponse(
        Integer id,
        Long version,
        String description,
        LocalDateTime date,
        Integer duration,
        Integer idModality,
        String modalityName,
        Integer idComplex,
        String complexName,
        Integer idCompetition,
        String competitionName,
        List<EventTeamResponse> teams,
        Map<Integer, List<TeamMemberResponse>> members,
        List<StatisticTypeResponse> statsTypes
) {
}