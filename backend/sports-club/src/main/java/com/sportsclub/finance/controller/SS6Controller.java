package com.sportsclub.finance.controller;

import java.net.URI;
import java.util.List;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sportsclub.finance.application.SS6Facade;
import com.sportsclub.finance.dto.filter.FeeFilterQuery;
import com.sportsclub.finance.dto.request.*;
import com.sportsclub.finance.dto.response.*;
import com.sportsclub.security.util.SecurityUtils;
import com.sportsclub.finance.dto.request.PaymentVersionRequest;

@RestController
@RequestMapping("/api")
public class SS6Controller {

    private final SS6Facade ss6Facade;

    public SS6Controller(SS6Facade ss6Facade) {
        this.ss6Facade = ss6Facade;
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/fees")
    public ResponseEntity<List<FeeResponse>> listFees(FeeFilterQuery filter) {
        return ResponseEntity.ok(ss6Facade.listFees(filter));
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE') or " +
            "(hasRole('ATHLETE') and #athleteId == authentication.principal.personId)")
    @GetMapping("/athletes/{athleteId}/fees")
    public ResponseEntity<List<FeeResponse>> listAthleteFees(
            @PathVariable Integer athleteId, FeeFilterQuery filter) {
        return ResponseEntity.ok(ss6Facade.listAthleteFees(athleteId, filter));
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE') or " +
            "(hasRole('ATHLETE') and #athleteId == authentication.principal.personId)")
    @GetMapping("/athletes/{athleteId}/debts")
    public ResponseEntity<List<FeeResponse>> listAthleteDebts(@PathVariable Integer athleteId) {
        return ResponseEntity.ok(ss6Facade.listAthleteDebts(athleteId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/payments")
    public ResponseEntity<List<PaymentResponse>> listPayments() {
        return ResponseEntity.ok(ss6Facade.listPayments());
    }

    @PreAuthorize("hasAnyRole('MANAGER', 'EMPLOYEE') or " +
            "(hasRole('ATHLETE') and #athleteId == authentication.principal.personId)")
    @GetMapping("/athletes/{athleteId}/payments")
    public ResponseEntity<List<PaymentResponse>> listAthletePayments(@PathVariable Integer athleteId) {
        return ResponseEntity.ok(ss6Facade.listAthletePayments(athleteId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/payments/cash")
    public ResponseEntity<PaymentResponse> registerCashPayment(
            @Valid @RequestBody RegisterCashPaymentRequest request) {

        PaymentResponse response = ss6Facade.registerCashPayment(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/payments/multibanco/in-person")
    public ResponseEntity<PaymentResponse> registerMultibancoInPersonPayment(
            @Valid @RequestBody RegisterMultibancoPresencialRequest request) {

        PaymentResponse response = ss6Facade.registerMultibancoInPersonPayment(request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or @ss6AuthorizationService.canAccessFee(#request.feeId())")
    @PostMapping("/payments/multibanco/online")
    public ResponseEntity<StartMultibancoOnlineResponse> startMultibancoOnlinePayment(
            @Valid @RequestBody StartMultibancoOnlineRequest request) {

        StartMultibancoOnlineResponse response = ss6Facade.startMultibancoOnlinePayment(
                request, getAuthenticatedPersonId());

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.paymentId())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or @ss6AuthorizationService.canAccessPayment(#paymentId)")
    @GetMapping("/payments/{paymentId}/multibanco")
    public ResponseEntity<MultibancoPaymentDataResponse> getMultibancoPaymentData(
            @PathVariable Integer paymentId) {
        return ResponseEntity.ok(ss6Facade.getMultibancoPaymentData(paymentId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or @ss6AuthorizationService.canAccessPayment(#paymentId)")
    @GetMapping("/payments/{paymentId}/status")
    public ResponseEntity<PaymentStatusResponse> getPaymentStatus(@PathVariable Integer paymentId) {
        return ResponseEntity.ok(ss6Facade.getPaymentStatus(paymentId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or @ss6AuthorizationService.canAccessPayment(#paymentId)")
    @PostMapping("/payments/{paymentId}/cancellation")
    public ResponseEntity<Void> cancelPendingPayment(
            @PathVariable Integer paymentId,
            @Valid @RequestBody PaymentVersionRequest request) {

        ss6Facade.cancelPendingPayment(
                paymentId,
                request.version(),
                getAuthenticatedPersonId());

        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or @ss6AuthorizationService.canAccessPayment(#paymentId)")
    @GetMapping("/payments/{paymentId}/fee")
    public ResponseEntity<FeeResponse> getFeeByPayment(@PathVariable Integer paymentId) {
        return ResponseEntity.ok(ss6Facade.getFeeByPayment(paymentId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or @ss6AuthorizationService.canAccessFee(#feeId)")
    @GetMapping("/fees/{feeId}/payment")
    public ResponseEntity<PaymentResponse> getPaymentByFee(@PathVariable Integer feeId) {
        return ResponseEntity.ok(ss6Facade.getPaymentByFee(feeId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PutMapping("/payments/{paymentId}/in-person")
    public ResponseEntity<PaymentResponse> updateInPersonPayment(
            @PathVariable Integer paymentId,
            @Valid @RequestBody UpdateInPersonPaymentRequest request) {

        Integer performedBy = getAuthenticatedPersonId();
        return ResponseEntity.ok(ss6Facade.updateInPersonPayment(paymentId, request, performedBy));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @DeleteMapping("/payments/{paymentId}/in-person")
    public ResponseEntity<Void> deleteInPersonPayment(
            @PathVariable Integer paymentId,
            @Valid @RequestBody PaymentVersionRequest request) {

        ss6Facade.deleteInPersonPayment(
                paymentId,
                request.version(),
                getAuthenticatedPersonId());

        return ResponseEntity.noContent().build();
    }

    private Integer getAuthenticatedPersonId() {
        return SecurityUtils.getAuthenticatedPersonId();
    }
}