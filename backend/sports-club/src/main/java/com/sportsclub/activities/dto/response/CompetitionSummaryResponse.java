package com.sportsclub.activities.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CompetitionSummaryResponse(
        Integer id,
        Long version,
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal registrationFee,
        Integer idModality,
        String modalityName,
        Integer registredTeams,
        Integer eventCount
) {
}