package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DebtFeeResponse(
        Integer id,
        BigDecimal amount,
        LocalDate dueDate
) {
}