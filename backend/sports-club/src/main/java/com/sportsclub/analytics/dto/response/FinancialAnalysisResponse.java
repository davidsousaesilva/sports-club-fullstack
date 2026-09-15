package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;

public record FinancialAnalysisResponse(
                BigDecimal revenue,
                BigDecimal expenses) {
}