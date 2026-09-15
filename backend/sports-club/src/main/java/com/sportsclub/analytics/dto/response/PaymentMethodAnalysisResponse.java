package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;

public record PaymentMethodAnalysisResponse(
                Integer countMultibanco,
                BigDecimal totalMultibanco,
                BigDecimal averageMultibanco,
                Integer countCash,
                BigDecimal totalCash,
                BigDecimal averageCash) {
}