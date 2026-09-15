package com.sportsclub.activities.domain.valueobjects;

import java.time.LocalDateTime;

public record TrainingData(
                String description,
                String note,
                LocalDateTime date,
                int duration) {
}