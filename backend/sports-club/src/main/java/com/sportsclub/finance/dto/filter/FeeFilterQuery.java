package com.sportsclub.finance.dto.filter;

import com.sportsclub.finance.domain.enums.FeeStatus;
import com.sportsclub.finance.domain.enums.FeeType;

import jakarta.validation.constraints.Pattern;

public record FeeFilterQuery(
        FeeStatus status,
        FeeType type,
        @Pattern(regexp = "^[a-zA-Z\\s]+$", message = "Name must contain only letters and spaces") String athleteOrTeamName) {
}