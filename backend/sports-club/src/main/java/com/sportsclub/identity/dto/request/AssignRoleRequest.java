package com.sportsclub.identity.dto.request;

import java.time.LocalDate;

import com.sportsclub.identity.domain.enums.Role;

import jakarta.validation.constraints.NotNull;

public record AssignRoleRequest(
        @NotNull(message = "Role is required.") Role role,

        @NotNull(message = "Start date is required.") LocalDate startDate,

        LocalDate endDate,

        @NotNull(message = "Primary role flag is required.") Boolean primaryRole,

        String endJustification) {
}