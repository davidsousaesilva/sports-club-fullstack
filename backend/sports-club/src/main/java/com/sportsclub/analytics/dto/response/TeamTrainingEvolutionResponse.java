package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;

public record TeamTrainingEvolutionResponse(
                Integer totalTrainings,
                BigDecimal attendanceRate) {
}