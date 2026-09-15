package com.sportsclub.teams.dto.response;

import com.sportsclub.teams.domain.enums.TeamType;

public record TeamSummaryResponse(
        Integer id,
        Long version,
        String name,
        TeamType teamType,
        String seasonYear,
        Boolean active,
        Integer modalityId,
        String modalityName,
        Integer athleteCount,
        Integer coachCount
) {
}