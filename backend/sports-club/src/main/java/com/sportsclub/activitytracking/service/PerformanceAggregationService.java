package com.sportsclub.activitytracking.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sportsclub.activitytracking.dto.response.AggregatedPerformanceResponse;
import com.sportsclub.activitytracking.dto.response.PerformanceResponse;

@Service
public class PerformanceAggregationService {

    public List<AggregatedPerformanceResponse> aggregateByAthlete(List<PerformanceResponse> performances) {
        Map<Integer, List<PerformanceResponse>> grouped = performances.stream()
                .collect(Collectors.groupingBy(
                        PerformanceResponse::athleteId,
                        LinkedHashMap::new,
                        Collectors.toList()));

        return grouped.values().stream()
                .map(AggregatedPerformanceResponse::new)
                .toList();
    }
}