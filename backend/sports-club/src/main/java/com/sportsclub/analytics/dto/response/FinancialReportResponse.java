package com.sportsclub.analytics.dto.response;

import java.math.BigDecimal;
import java.util.Map;

public record FinancialReportResponse(
        BigDecimal totalReceived,
        BigDecimal debt,
        Integer pendingFees,
        BigDecimal paymentRate,
        Map<String, FinancialAnalysisResponse> financialAnalysis,
        Map<String, BigDecimal> profitTrend,
        Map<String, BigDecimal> feeStatusState,
        Map<String, BigDecimal> revenuesBySource,
        FeeTypeAnalysisResponse feeAnalysisByType,
        PaymentMethodAnalysisResponse paymentsByMethod) {
}