package com.sportsclub.analytics.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record CalendarActivityResponse(
        Integer id,
        CalendarActivityType type,
        String description,
        LocalDateTime start,
        LocalDateTime end,
        String modalityName,
        String location,

        // training
        String teamName,

        // event
        List<String> teamNames,
        String competitionName
) {
}