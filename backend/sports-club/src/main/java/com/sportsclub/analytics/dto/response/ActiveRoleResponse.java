package com.sportsclub.analytics.dto.response;

import java.time.LocalDate;

public record ActiveRoleResponse(
                String role,
                LocalDate since,
                Boolean primary) {
}