package com.sportsclub.finance.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.finance.service.FeeGenerationService;

@Service
public class FeeSchedulerService {

    private final FeeGenerationService feeGenerationService;

    public FeeSchedulerService(FeeGenerationService feeGenerationService) {
        this.feeGenerationService = feeGenerationService;
    }

    @Scheduled(cron = "${app.fees.monthly-generation-cron}")
    @Transactional
    public void generateDueMonthlyFees() {
        feeGenerationService.generateDueMonthlyFees(LocalDateTime.now(), null);
    }
}