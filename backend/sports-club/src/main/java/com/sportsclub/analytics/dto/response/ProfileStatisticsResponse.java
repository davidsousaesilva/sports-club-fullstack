package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;

public record ProfileStatisticsResponse(
                MedalCountResponse medals,
                BigDecimal averageTrainings,
                Integer totalTrainingEvaluations,
                BigDecimal averageEvents,
                Integer totalEventEvaluations,
                Integer presentCount,
                Integer absentCount,
                Integer trainingParticipations,
                Integer eventParticipations,
                Integer freeTrainingParticipations) {
}