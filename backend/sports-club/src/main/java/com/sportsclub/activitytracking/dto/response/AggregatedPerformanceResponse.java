package com.sportsclub.activitytracking.dto.response;

import java.util.List;

public record AggregatedPerformanceResponse(
                List<PerformanceResponse> performances) {
}