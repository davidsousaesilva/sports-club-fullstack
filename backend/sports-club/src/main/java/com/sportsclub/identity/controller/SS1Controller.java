package com.sportsclub.identity.controller;

import java.net.URI;
import java.time.LocalDate;
import java.util.List;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.sportsclub.identity.application.SS1Facade;
import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.identity.dto.filter.PersonFilter;
import com.sportsclub.identity.dto.request.AlterPasswordRequest;
import com.sportsclub.identity.dto.request.AssignRoleRequest;
import com.sportsclub.identity.dto.request.CreatePersonRequest;
import com.sportsclub.identity.dto.request.SetPasswordByStaffRequest;
import com.sportsclub.identity.dto.request.TerminateRoleRequest;
import com.sportsclub.identity.dto.request.UpdatePersonRequest;
import com.sportsclub.identity.dto.response.AlterPasswordResponse;
import com.sportsclub.identity.dto.response.BooleanResponse;
import com.sportsclub.identity.dto.response.NotificationResponse;
import com.sportsclub.identity.dto.response.PersonResponse;
import com.sportsclub.identity.dto.response.PersonRoleResponse;
import com.sportsclub.identity.dto.response.ProfileDataResponse;
import com.sportsclub.security.util.SecurityUtils;

@RestController
@RequestMapping("/api")
public class SS1Controller {

    private final SS1Facade ss1Facade;

    public SS1Controller(SS1Facade ss1Facade) {
        this.ss1Facade = ss1Facade;
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or #personId == authentication.principal.personId")
    @GetMapping("/profile/{personId}")
    public ResponseEntity<ProfileDataResponse> getProfileData(@PathVariable Integer personId) {
        return ResponseEntity.ok(ss1Facade.getProfileData(personId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @GetMapping("/people")
    public ResponseEntity<List<PersonResponse>> listPeople(
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) Boolean active,
            @RequestParam(required = false) String personNameOrEmail) {
        PersonFilter filter = new PersonFilter(role, active, personNameOrEmail);
        return ResponseEntity.ok(ss1Facade.listPeople(filter));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or #personId == authentication.principal.personId")
    @GetMapping("/people/{personId}")
    public ResponseEntity<PersonResponse> getPerson(@PathVariable Integer personId) {
        return ResponseEntity.ok(ss1Facade.getPerson(personId));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/people")
    public ResponseEntity<PersonResponse> createPerson(@Valid @RequestBody CreatePersonRequest request) {
        PersonResponse response = ss1Facade.createPerson(request, getAuthenticatedPersonId());

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
    @PutMapping("/people/{personId}")
    public ResponseEntity<Void> updatePerson(
            @PathVariable Integer personId,
            @Valid @RequestBody UpdatePersonRequest request) {
        ss1Facade.updatePerson(personId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or #personId == authentication.principal.personId")
    @PostMapping("/people/{personId}/password")
    public ResponseEntity<AlterPasswordResponse> alterPassword(
            @PathVariable Integer personId,
            @Valid @RequestBody AlterPasswordRequest request) {
        return ResponseEntity.ok(
                ss1Facade.alterPassword(personId, request, getAuthenticatedPersonId()));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/people/{personId}/password/reset")
    public ResponseEntity<Void> setPasswordByStaff(
            @PathVariable Integer personId,
            @Valid @RequestBody SetPasswordByStaffRequest request) {
        ss1Facade.setPasswordByStaff(personId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or #personId == authentication.principal.personId")
    @GetMapping("/people/{personId}/roles")
    public ResponseEntity<List<PersonRoleResponse>> listActiveRoles(
            @PathVariable Integer personId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate on) {
        return ResponseEntity.ok(ss1Facade.listActiveRoles(personId, on));
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/people/{personId}/roles")
    public ResponseEntity<PersonRoleResponse> assignRole(
            @PathVariable Integer personId,
            @Valid @RequestBody AssignRoleRequest request) {
        PersonRoleResponse response = ss1Facade.assignRole(personId, request, getAuthenticatedPersonId());

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
    @PostMapping("/person-roles/{personRoleId}/termination")
    public ResponseEntity<Void> terminateRole(
            @PathVariable Integer personRoleId,
            @Valid @RequestBody TerminateRoleRequest request) {
        ss1Facade.terminateRole(personRoleId, request, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE')")
    @PostMapping("/person-roles/{personRoleId}/primary")
    public ResponseEntity<Void> makeRolePrimary(@PathVariable Integer personRoleId) {
        ss1Facade.makeRolePrimary(personRoleId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAnyRole('MANAGER','EMPLOYEE') or #personId == authentication.principal.personId")
    @GetMapping("/people/{personId}/roles/{role}/active")
    public ResponseEntity<BooleanResponse> personHasActiveRole(
            @PathVariable Integer personId,
            @PathVariable Role role,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate on) {
        return ResponseEntity.ok(ss1Facade.personHasActiveRole(personId, role, on));
    }

    @GetMapping("/people/{personId}/notifications")
    public ResponseEntity<List<NotificationResponse>> listNotifications(
            @PathVariable Integer personId,
            @RequestParam(required = false) Boolean read) {
        return ResponseEntity.ok(ss1Facade.listNotifications(personId, read));
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping("/notifications/{notificationId}/read")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable Integer notificationId) {
        ss1Facade.markNotificationAsRead(notificationId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/notifications/{notificationId}")
    public ResponseEntity<Void> removeNotification(@PathVariable Integer notificationId) {
        ss1Facade.removeNotification(notificationId, getAuthenticatedPersonId());
        return ResponseEntity.noContent().build();
    }

    // private Integer getAuthenticatedPersonId() {
    //     return 1; // ou qualquer ID existente
    // }

    private Integer getAuthenticatedPersonId() {
        return SecurityUtils.getAuthenticatedPersonId();
    }
}