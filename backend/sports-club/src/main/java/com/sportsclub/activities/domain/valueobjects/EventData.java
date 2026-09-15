package com.sportsclub.activities.domain.valueobjects;

import java.time.LocalDateTime;

public record EventData(
                String description,
                LocalDateTime date,
                int duration) {
}