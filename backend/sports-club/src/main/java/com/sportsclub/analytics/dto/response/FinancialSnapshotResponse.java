package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;

public record FinancialSnapshotResponse(
                BigDecimal revenue,
                BigDecimal expenses) {
}