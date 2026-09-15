package com.sportsclub.activities.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record CompetitionResponse(
        Integer id,
        Long version,
        String name,
        String description,
        LocalDate startDate,
        LocalDate endDate,
        BigDecimal registrationFee,
        Integer idModality,
        String modalityName,
        List<CompetitionTeamResponse> registeredTeams,
        List<EventSummaryResponse> events
) {
}