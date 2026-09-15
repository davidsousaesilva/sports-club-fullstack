package com.sportsclub.activities.dto.filter;

import com.sportsclub.activities.domain.enums.TemporalStatus;

public record TrainingFilter(
                Integer teamId,
                Integer complexId,
                TemporalStatus temporalStatus,
                String trainingDescriptionOrTeam) {
}