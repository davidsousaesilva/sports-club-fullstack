package com.sportsclub.activitytracking.dto.response;

import java.math.BigDecimal;

public record PerformanceResponse(
        Integer id,
        Long version,
        BigDecimal value,
        String note,
        Integer statisticTypeId,
        String statisticTypeName,
        String statisticTypeUnit,
        Integer athleteId,
        String athleteName,
        Integer coachId,
        String coachName,
        Integer trainingId,
        Integer eventId
) {
}