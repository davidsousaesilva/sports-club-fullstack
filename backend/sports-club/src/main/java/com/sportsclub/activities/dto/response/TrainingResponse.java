package com.sportsclub.activities.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import com.sportsclub.sportscore.dto.response.StatisticTypeResponse;
import com.sportsclub.teams.dto.response.TeamMemberResponse;

public record TrainingResponse(
        Integer id,
        Long version,
        String description,
        String note,
        LocalDateTime date,
        Integer duration,
        Integer idComplex,
        String complexName,
        Integer idTeam,
        String teamName,
        List<TeamMemberResponse> members,
        List<StatisticTypeResponse> statsTypes
) {
}