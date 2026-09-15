package com.sportsclub.activities.domain.valueobjects;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CompetitionData(
                String name,
                String description,
                LocalDate startDate,
                LocalDate endDate,
                BigDecimal registrationFee) {
}