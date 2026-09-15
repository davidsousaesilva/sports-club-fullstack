package com.sportsclub.identity.dto.response;

import java.time.LocalDate;
import java.util.List;

import com.sportsclub.analytics.dto.response.ActiveRoleResponse;
import com.sportsclub.analytics.dto.response.RoleHistoryResponse;

public record ProfileDataResponse(
        PersonResponse person,
        List<RoleHistoryResponse> temporalHistory) {
}