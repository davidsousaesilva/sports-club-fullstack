package com.sportsclub.analytics.dto.response;

import java.time.LocalDate;

public record UpcomingActivityResponse(
                Integer id,
                String title,
                LocalDate date) {
}