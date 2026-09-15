package com.sportsclub.sportscore.dto.response;

import java.util.List;

import com.sportsclub.teams.dto.response.TeamSummaryResponse;

public record ModalityResponse(
        Integer id,
        Long version,
        String name,
        String eventType,
        String description,
        Boolean trained,
        Integer maxWeeklyAttendances,
        List<StatisticTypeResponse> statisticTypes,
        List<ModalityPriceResponse> prices,
        List<TeamSummaryResponse> teams
) {
}