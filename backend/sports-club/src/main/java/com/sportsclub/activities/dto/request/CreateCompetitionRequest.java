package com.sportsclub.activities.dto.request;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateCompetitionRequest(
                String name,
                String description,
                LocalDate startDate,
                LocalDate endDate,
                BigDecimal registrationFee,
                Integer modalityId) {
}