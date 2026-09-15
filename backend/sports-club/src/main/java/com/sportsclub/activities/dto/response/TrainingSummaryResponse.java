package com.sportsclub.activities.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TrainingSummaryResponse(
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
        BigDecimal presentAthletesPercent,
        BigDecimal performanceEntriesPercent
) {
}