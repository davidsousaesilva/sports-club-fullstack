package com.sportsclub.analytics.dto.response;

import java.time.LocalDate;

public record RoleHistoryResponse(
                String role,
                LocalDate entryDate,
                LocalDate exitDate) {
}