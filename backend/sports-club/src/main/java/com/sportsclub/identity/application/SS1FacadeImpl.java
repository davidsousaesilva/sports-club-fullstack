package com.sportsclub.identity.application;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.analytics.dto.response.ActiveRoleResponse;
import com.sportsclub.analytics.dto.response.RoleHistoryResponse;
import com.sportsclub.identity.domain.entities.Notification;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.domain.entities.PersonRole;
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
import com.sportsclub.identity.repository.NotificationRepository;
import com.sportsclub.identity.repository.PersonRepository;
import com.sportsclub.identity.repository.PersonRoleRepository;
import com.sportsclub.identity.repository.PersonSpecifications;
import com.sportsclub.identity.service.NotificationService;
import com.sportsclub.identity.service.SS1FactoryService;
import com.sportsclub.identity.service.SS1Mapper;
import com.sportsclub.shared.application.VersionValidator;
import com.sportsclub.shared.controller.InvalidCurrentPasswordException;

@Service
@Transactional
public class SS1FacadeImpl implements SS1Facade {

    private final PersonRepository personRepository;
    private final PersonRoleRepository personRoleRepository;
    private final NotificationRepository notificationRepository;
    private final SS1Mapper ss1Mapper;
    private final NotificationService notificationService;
    private final SS1FactoryService ss1FactoryService;
    private final PersonAuthorizationService personAuthorizationService;
    private final PasswordEncoder passwordEncoder;
    private final VersionValidator versionValidator;

    public SS1FacadeImpl(
            PersonRepository personRepository,
            PersonRoleRepository personRoleRepository,
            NotificationRepository notificationRepository,
            SS1Mapper ss1Mapper,
            NotificationService notificationService,
            SS1FactoryService ss1FactoryService,
            PersonAuthorizationService personAuthorizationService,
            PasswordEncoder passwordEncoder,
            VersionValidator versionValidator) {
        this.personRepository = personRepository;
        this.personRoleRepository = personRoleRepository;
        this.notificationRepository = notificationRepository;
        this.ss1Mapper = ss1Mapper;
        this.notificationService = notificationService;
        this.ss1FactoryService = ss1FactoryService;
        this.personAuthorizationService = personAuthorizationService;
        this.passwordEncoder = passwordEncoder;
        this.versionValidator = versionValidator;
    }

    @Override
    public ProfileDataResponse getProfileData(Integer personId) {
        Person person = personRepository.findById(personId)
                .orElseThrow(() -> new IllegalArgumentException("Person not found."));

        List<RoleHistoryResponse> history = personRoleRepository.findByPersonId(personId).stream()
                .map(role -> new RoleHistoryResponse(
                        role.getRole().name(),
                        role.getStartDate(),
                        role.getEndDate()))
                .toList();

        return new ProfileDataResponse(
                ss1Mapper.toPersonResponse(person, LocalDate.now()),
                history);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonResponse> listPeople(PersonFilter filter) {
        return personRepository.findAll(PersonSpecifications.withFilter(filter)).stream()
                .map(person -> ss1Mapper.toPersonResponse(person, LocalDate.now()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PersonResponse getPerson(Integer personId) {
        Person person = getExistingPerson(personId);
        return ss1Mapper.toPersonResponse(person, LocalDate.now());
    }

    @Override
    public PersonResponse createPerson(CreatePersonRequest request, Integer performedBy) {
        if (personRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalStateException("Email already exists.");
        }

        Person person = new Person(
                request.name(),
                request.gender(),
                request.email(),
                request.phone(),
                request.address(),
                request.birthDate(),
                request.entryDate(),
                request.active());
        
        Person actor = getExistingPerson(performedBy);

        // Definir password default
        person.definePasswordByStaff(
            passwordEncoder.encode("pass123"),
            actor);

        Person saved = personRepository.save(person);
        return ss1Mapper.toPersonResponse(saved, LocalDate.now());
    }

    @Override
    public void updatePerson(Integer personId, UpdatePersonRequest request, Integer performedBy) {
        Person person = getExistingPerson(personId);
        Person actor = getExistingPerson(performedBy);

        versionValidator.validate(request.version(), person.getVersion());

        personAuthorizationService.ensureCanManagePerson(actor, person);

        if (personRepository.existsByEmailIgnoreCaseAndIdNot(request.email(), personId)) {
            throw new IllegalStateException("Email already exists.");
        }

        person.update(
                ss1FactoryService.toPersonData(request),
                actor);
    }

    @Override
    public AlterPasswordResponse alterPassword(Integer personId, AlterPasswordRequest request, Integer performedBy) {
        Person person = getExistingPerson(personId);
        Person actor = getExistingPerson(performedBy);

        if (!person.getId().equals(performedBy)) {
            throw new SecurityException("A person can only alter their own password.");
        }

        if (!request.newPassword1().equals(request.newPassword2())) {
            throw new IllegalArgumentException("New passwords do not match.");
        }

        if (person.getPasswordHash() == null ||
                !passwordEncoder.matches(
                        request.currentPassword(),
                        person.getPasswordHash())) {

            throw new InvalidCurrentPasswordException(
                    "Current password is incorrect.");
        }

        person.changePassword(
                person.getPasswordHash(),
                passwordEncoder.encode(request.newPassword1()),
                actor);

        return new AlterPasswordResponse(true);
    }

    @Override
    public void setPasswordByStaff(Integer personId, SetPasswordByStaffRequest request, Integer performedBy) {
        Person person = getExistingPerson(personId);
        Person actor = getExistingPerson(performedBy);

        personAuthorizationService.ensureCanManagePerson(actor, person);

        if (!request.newPassword1().equals(request.newPassword2())) {
            throw new IllegalArgumentException("New passwords do not match.");
        }

        person.definePasswordByStaff(
                passwordEncoder.encode(request.newPassword1()),
                actor);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PersonRoleResponse> listActiveRoles(Integer personId, LocalDate onDate) {
        Person person = getExistingPerson(personId);

        return person.getActiveRoles(onDate).stream()
                .map(ss1Mapper::toPersonRoleResponse)
                .toList();
    }

    @Override
    public PersonRoleResponse assignRole(Integer personId, AssignRoleRequest request, Integer performedBy) {
        Person person = getExistingPerson(personId);
        Person actor = getExistingPerson(performedBy);

        personAuthorizationService.ensureCanAssignRole(actor, person, request.role());

        PersonRole personRole = new PersonRole(
                request.role(),
                request.startDate(),
                request.endDate(),
                Boolean.TRUE.equals(request.primaryRole()),
                request.endJustification(),
                person);

        person.assignRole(personRole, actor);

        PersonRole saved = personRoleRepository.save(personRole);
        return ss1Mapper.toPersonRoleResponse(saved);
    }

    @Override
    public void terminateRole(Integer personRoleId, TerminateRoleRequest request, Integer performedBy) {
        PersonRole personRole = getExistingPersonRole(personRoleId);
        Person actor = getExistingPerson(performedBy);

        versionValidator.validate(request.version(), personRole.getVersion());

        personAuthorizationService.ensureCanManageRole(actor, personRole);

        personRole.getPerson().terminateRole(personRole, request.endJustification(), actor);
    }

    @Override
    public void makeRolePrimary(Integer personRoleId, Integer performedBy) {
        PersonRole targetRole = getExistingPersonRole(personRoleId);
        Person actor = getExistingPerson(performedBy);

        personAuthorizationService.ensureCanManageRole(actor, targetRole);

        targetRole.getPerson().makeRolePrimary(targetRole, actor);
    }

    @Override
    @Transactional(readOnly = true)
    public BooleanResponse personHasActiveRole(Integer personId, Role role, LocalDate onDate) {
        Person person = getExistingPerson(personId);
        return new BooleanResponse(person.hasActiveRole(role, onDate));
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> listNotifications(Integer personId, Boolean read) {
        Person person = getExistingPerson(personId);

        if (read == null) {
            return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(person.getId())
                    .stream()
                    .map(ss1Mapper::toNotificationResponse)
                    .toList();
        }

        return notificationRepository.findByRecipientIdAndReadOrderByCreatedAtDesc(person.getId(), read)
                .stream()
                .map(ss1Mapper::toNotificationResponse)
                .toList();
    }

    @Override
    public void markNotificationAsRead(Integer notificationId, Integer performedBy) {
        Notification notification = getExistingNotification(notificationId);
        Person actor = getExistingPerson(performedBy);

        notificationService.markAsRead(notification, actor);
    }

    @Override
    public void removeNotification(Integer notificationId, Integer performedBy) {
        Notification notification = getExistingNotification(notificationId);
        Person actor = getExistingPerson(performedBy);

        notificationService.remove(notification, actor);
    }

    private Person getExistingPerson(Integer personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException("Person not found: " + personId));
    }

    private PersonRole getExistingPersonRole(Integer personRoleId) {
        return personRoleRepository.findById(personRoleId)
                .orElseThrow(() -> new EntityNotFoundException("Person role not found: " + personRoleId));
    }

    private Notification getExistingNotification(Integer notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found: " + notificationId));
    }
}