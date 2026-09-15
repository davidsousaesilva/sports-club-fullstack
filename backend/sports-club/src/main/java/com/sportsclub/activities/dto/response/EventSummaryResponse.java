package com.sportsclub.activities.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record EventSummaryResponse(
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
        BigDecimal presentAthletesPercent,
        BigDecimal performanceEntriesPercent
) {
}