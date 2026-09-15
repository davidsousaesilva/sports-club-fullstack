package com.sportsclub.analytics.controller;

import java.util.List;

import com.sportsclub.identity.domain.enums.Role;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sportsclub.analytics.application.SS7Facade;
import com.sportsclub.analytics.dto.response.*;

@RestController
@RequestMapping("/api")
public class SS7Controller {

    private final SS7Facade ss7Facade;

    public SS7Controller(SS7Facade ss7Facade) {
        this.ss7Facade = ss7Facade;
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardResponse> calculateDashboard() {
        return ResponseEntity.ok(ss7Facade.calculateDashboard());
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/reports/sport")
    public ResponseEntity<SportReportResponse> calculateSportReport() {
        return ResponseEntity.ok(ss7Facade.calculateSportReport());
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/reports/financial")
    public ResponseEntity<FinancialReportResponse> calculateFinancialReport() {
        return ResponseEntity.ok(ss7Facade.calculateFinancialReport());
    }

    @PreAuthorize("hasRole('MANAGER') or #personId == authentication.principal.personId")
    @GetMapping("/profile/{personId}/statistics")
    public ResponseEntity<ProfileStatisticsResponse> getProfileStatistics(@PathVariable Integer personId) {
        return ResponseEntity.ok(ss7Facade.getProfileStatistics(personId));
    }

    @GetMapping("/calendar")
    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE','COACH','ATHLETE')")
    public ResponseEntity<List<CalendarActivityResponse>> getCalendarActivities(
            @RequestParam Integer month,
            @RequestParam Integer year,
            @RequestParam(required = false) Integer personId,
            @RequestParam(required = false) Role view
    ) {
        return ResponseEntity.ok(
                ss7Facade.getCalendarActivities(month, year, personId, view)
        );
    }
}