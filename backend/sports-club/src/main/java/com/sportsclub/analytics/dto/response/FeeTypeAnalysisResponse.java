package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;

public record FeeTypeAnalysisResponse(
                Integer numberOfRegistrations,
                BigDecimal averageRegistrations,
                Integer numberOfMonthlyFees,
                BigDecimal averageMonthlyFees,
                Integer numberOfCompetitionFees,
                BigDecimal averageCompetitionFees) {
}