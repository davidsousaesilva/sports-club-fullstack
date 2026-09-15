package com.sportsclub.identity.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TerminateRoleRequest(
        @NotNull(message = "Version is required.") Long version,

        @NotBlank(message = "End justification is required.") String endJustification) 
        {
}