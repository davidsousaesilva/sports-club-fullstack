package com.sportsclub.sportscore.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sportsclub.security.util.SecurityUtils;
import com.sportsclub.sportscore.application.SS2Facade;
import com.sportsclub.sportscore.dto.filter.ModalityFilter;
import com.sportsclub.sportscore.dto.request.CreateComplexRequest;
import com.sportsclub.sportscore.dto.request.CreateModalityRequest;
import com.sportsclub.sportscore.dto.request.CreateStatisticTypeRequest;
import com.sportsclub.sportscore.dto.request.UpdateComplexRequest;
import com.sportsclub.sportscore.dto.request.UpdateModalityRequest;
import com.sportsclub.sportscore.dto.request.UpdateStatisticTypeRequest;
import com.sportsclub.sportscore.dto.response.CalculatedPriceResponse;
import com.sportsclub.sportscore.dto.response.ComplexResponse;
import com.sportsclub.sportscore.dto.response.ModalityPriceResponse;
import com.sportsclub.sportscore.dto.response.ModalityResponse;
import com.sportsclub.sportscore.dto.response.ModalitySummaryResponse;
import com.sportsclub.sportscore.dto.response.StatisticTypeResponse;
import com.sportsclub.teams.dto.response.TeamSummaryResponse;

@RestController
@RequestMapping("/api")
public class SS2Controller {

    private final SS2Facade ss2Facade;

    public SS2Controller(SS2Facade ss2Facade) {
        this.ss2Facade = ss2Facade;
    }

    @PreAuthorize("hasRole('COACH') and #coachId == authentication.principal.personId")
    @GetMapping("/coaches/{coachId}/modalities")
    public ResponseEntity<List<ModalitySummaryResponse>> listCoachModalities(
            @PathVariable Integer coachId) {

        return ResponseEntity.ok(ss2Facade.listCoachModalities(coachId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/modalities")
    public ResponseEntity<List<ModalityResponse>> listModalities(
            @RequestParam(required = false) Boolean trained,
            @RequestParam(required = false) String modalityNameOrDescription) {

        ModalityFilter filter = new ModalityFilter(trained, modalityNameOrDescription);
        return ResponseEntity.ok(ss2Facade.listModalities(filter));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/modalities/{modalityId}")
    public ResponseEntity<ModalityResponse> getModality(@PathVariable Integer modalityId) {
        return ResponseEntity.ok(ss2Facade.getModality(modalityId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/modalities")
    public ResponseEntity<ModalityResponse> createModality(
            @Valid @RequestBody CreateModalityRequest request) {

        ModalityResponse response = ss2Facade.createModality(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PutMapping("/modalities/{modalityId}")
    public ResponseEntity<Void> updateModality(
            @PathVariable Integer modalityId,
            @Valid @RequestBody UpdateModalityRequest request) {

        ss2Facade.updateModality(modalityId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @DeleteMapping("/modalities/{modalityId}")
    public ResponseEntity<Void> deleteModality(@PathVariable Integer modalityId) {
        ss2Facade.deleteModality(modalityId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE','COACH')")
    @GetMapping("/modalities/{modalityId}/statistic-types")
    public ResponseEntity<List<StatisticTypeResponse>> listStatisticTypesByModality(
            @PathVariable Integer modalityId) {

        return ResponseEntity.ok(ss2Facade.listStatisticTypesByModality(modalityId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/modalities/{modalityId}/prices")
    public ResponseEntity<List<ModalityPriceResponse>> listPricesByModality(
            @PathVariable Integer modalityId) {

        return ResponseEntity.ok(ss2Facade.listPricesByModality(modalityId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/modalities/{modalityId}/registration-price")
    public ResponseEntity<CalculatedPriceResponse> getRegistrationPrice(
            @PathVariable Integer modalityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthDate) {

        return ResponseEntity.ok(ss2Facade.getRegistrationPrice(modalityId, birthDate));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/modalities/{modalityId}/monthly-fee")
    public ResponseEntity<CalculatedPriceResponse> getMonthlyFee(
            @PathVariable Integer modalityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate birthDate) {

        return ResponseEntity.ok(ss2Facade.getMonthlyFee(modalityId, birthDate));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/statistic-types")
    public ResponseEntity<List<StatisticTypeResponse>> listStatisticTypes() {
        return ResponseEntity.ok(ss2Facade.listStatisticTypes());
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/statistic-types")
    public ResponseEntity<StatisticTypeResponse> createStatisticType(
            @Valid @RequestBody CreateStatisticTypeRequest request) {

        StatisticTypeResponse response = ss2Facade.createStatisticType(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PutMapping("/statistic-types/{statisticTypeId}")
    public ResponseEntity<Void> updateStatisticType(
            @PathVariable Integer statisticTypeId,
            @Valid @RequestBody UpdateStatisticTypeRequest request) {

        ss2Facade.updateStatisticType(statisticTypeId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @DeleteMapping("/statistic-types/{statisticTypeId}")
    public ResponseEntity<Void> deleteStatisticType(@PathVariable Integer statisticTypeId) {
        ss2Facade.deleteStatisticType(statisticTypeId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE','COACH', 'ATHLETE')")
    @GetMapping("/complexes")
    public ResponseEntity<List<ComplexResponse>> listComplexes() {
        return ResponseEntity.ok(ss2Facade.listComplexes());
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE','COACH')")
    @GetMapping("/complexes/{complexId}")
    public ResponseEntity<ComplexResponse> getComplex(@PathVariable Integer complexId) {
        return ResponseEntity.ok(ss2Facade.getComplex(complexId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/complexes")
    public ResponseEntity<ComplexResponse> createComplex(
            @Valid @RequestBody CreateComplexRequest request) {

        ComplexResponse response = ss2Facade.createComplex(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity
                .created(location)
                .body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PutMapping("/complexes/{complexId}")
    public ResponseEntity<Void> updateComplex(
            @PathVariable Integer complexId,
            @Valid @RequestBody UpdateComplexRequest request) {

        ss2Facade.updateComplex(complexId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @DeleteMapping("/complexes/{complexId}")
    public ResponseEntity<Void> deleteComplex(@PathVariable Integer complexId) {
        ss2Facade.deleteComplex(complexId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/modalities/{modalityId}/teams")
    public ResponseEntity<List<TeamSummaryResponse>> getModalityTeams(
            @PathVariable Integer modalityId) {
        return ResponseEntity.ok(ss2Facade.getModalityTeams(modalityId));
    }

    private Integer getAuthenticatedPersonId() {
        return SecurityUtils.getAuthenticatedPersonId();
    }
}