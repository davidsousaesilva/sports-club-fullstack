package com.sportsclub.identity.domain.entities;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import com.sportsclub.identity.domain.enums.Gender;
import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.identity.domain.valueobjects.PersonData;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "person")
public class Person extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    private Gender gender;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "phone", length = 50)
    private String phone;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "password_hash", columnDefinition = "TEXT")
    private String passwordHash;

    @Column(name = "entry_date")
    private LocalDate entryDate;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PersonRole> roles = new ArrayList<>();

    @OneToMany(mappedBy = "recipient")
    private List<Notification> notifications = new ArrayList<>();

    @Column(name = "address", length = 255)
    private String address;

    public Person() {
    }

    public Person(
            String name,
            Gender gender,
            String email,
            String phone,
            String address,
            LocalDate birthDate,
            LocalDate entryDate,
            boolean active) {
        this.name = name;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.birthDate = birthDate;
        this.entryDate = entryDate;
        this.active = active;
    }

    public void update(PersonData data, Person by) {
        this.name = data.name();
        this.gender = data.gender();
        this.email = data.email();
        this.phone = data.phone();
        this.address = data.address();
        this.birthDate = data.birthDate();
        this.entryDate = data.entryDate();
        this.active = data.active();
        touch(by);
    }

    public boolean changePassword(String currentPasswordHash, String newPasswordHash, Person by) {
        if (this.passwordHash == null || !Objects.equals(this.passwordHash, currentPasswordHash)) {
            return false;
        }

        this.passwordHash = newPasswordHash;
        touch(by);
        return true;
    }

    public boolean alterOwnPassword(
            Integer performedBy,
            String currentPassword,
            String newPassword1,
            String newPassword2,
            Person actor) {
        if (!Objects.equals(this.id, performedBy)) {
            throw new SecurityException("A person can only alter their own password.");
        }

        if (!Objects.equals(newPassword1, newPassword2)) {
            throw new IllegalArgumentException("New passwords do not match.");
        }

        return changePassword(currentPassword, newPassword1, actor);
    }

    public void definePasswordByStaff(String newPasswordHash, Person by) {
        this.passwordHash = newPasswordHash;
        touch(by);
    }

    public void setPasswordByStaff(String newPassword1, String newPassword2, Person actor) {
        if (!Objects.equals(newPassword1, newPassword2)) {
            throw new IllegalArgumentException("New passwords do not match.");
        }

        definePasswordByStaff(newPassword1, actor);
    }

    public void addRole(PersonRole personRole) {
        if (personRole == null) {
            throw new IllegalArgumentException("personRole cannot be null.");
        }

        boolean alreadyExists = this.roles.stream()
                .anyMatch(existing -> existing == personRole
                        || (existing.getId() != null && existing.getId().equals(personRole.getId())));

        if (alreadyExists) {
            return;
        }

        personRole.setPerson(this);
        this.roles.add(personRole);
    }

    public void assignRole(PersonRole personRole, Person by) {
        if (personRole == null) {
            throw new IllegalArgumentException("personRole cannot be null.");
        }

        if (!ownsRole(personRole)) {
            throw new IllegalArgumentException("Role does not belong to this person.");
        }

        ensureRoleDoesNotOverlap(personRole);

        boolean wasInactive = !this.active;

        if (wasInactive) {
            this.active = true;
        }

        addRole(personRole);

        if (personRole.isPrimaryRole() || wasInactive) {
            makeRolePrimary(personRole, by);
        } else {
            touch(by);
        }
    }

    public void makeRolePrimary(PersonRole targetRole, Person by) {
        if (targetRole == null) {
            throw new IllegalArgumentException("targetRole cannot be null.");
        }

        if (!ownsRole(targetRole)) {
            throw new IllegalArgumentException("Role does not belong to this person.");
        }

        removeCurrentPrimaryRole(by);
        targetRole.makePrimary(by);
        touch(by);
    }

    public void removeCurrentPrimaryRole(Person by) {
        for (PersonRole role : roles) {
            if (role.isPrimaryRole() && role.isActive(LocalDate.now())) {
                role.removeAsPrimary(by);
            }
        }
    }

    public boolean hasActiveRole(Role role, LocalDate onDate) {
        LocalDate effectiveDate = onDate != null ? onDate : LocalDate.now();

        return roles.stream()
                .anyMatch(personRole -> personRole.getRole() == role && personRole.isActive(effectiveDate));
    }

    public List<PersonRole> getActiveRoles(LocalDate onDate) {
        LocalDate effectiveDate = onDate != null ? onDate : LocalDate.now();

        return roles.stream()
                .filter(role -> role.isActive(effectiveDate))
                .toList();
    }

    public List<PersonRole> getCurrentRoles() {
        return roles.stream()
                .filter(role -> role.getEndDate() == null)
                .toList();
    }

    public boolean hasCurrentRoles() {
        return roles.stream()
                .anyMatch(role -> role.getEndDate() == null);
    }

    public void refreshActiveStatus(Person by) {
        boolean shouldBeActive = hasCurrentRoles();

        if (this.active != shouldBeActive) {
            this.active = shouldBeActive;
            touch(by);
        }
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Gender getGender() {
        return gender;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public boolean isActive() {
        return active;
    }

    public List<PersonRole> getRoles() {
        return List.copyOf(roles);
    }

    public List<Notification> getNotifications() {
        return List.copyOf(notifications);
    }

    public String getAddress() {
        return address;
    }

    public void terminateRole(PersonRole targetRole, String endJustification, Person by) {
        if (targetRole == null) {
            throw new IllegalArgumentException("targetRole cannot be null.");
        }

        if (!ownsRole(targetRole)) {
            throw new IllegalArgumentException("Role does not belong to this person.");
        }

        boolean wasPrimary = targetRole.isPrimaryRole();

        targetRole.terminate(endJustification, by);

        List<PersonRole> currentRoles = getCurrentRoles();

        if (currentRoles.isEmpty()) {
            this.active = false;
            touch(by);
            return;
        }

        if (wasPrimary) {
            PersonRole nextPrimary = choosePrimaryRoleByHierarchy(currentRoles);
            makeRolePrimary(nextPrimary, by);
        } else {
            this.active = true;
            touch(by);
        }
    }

    private PersonRole choosePrimaryRoleByHierarchy(List<PersonRole> activeRoles) {
        return activeRoles.stream()
                .sorted((a, b) -> Integer.compare(
                        getRolePriority(a.getRole()),
                        getRolePriority(b.getRole())))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("No active roles available."));
    }

    private int getRolePriority(Role role) {
        return switch (role) {
            case MANAGER -> 1;
            case EMPLOYEE -> 2;
            case COACH -> 3;
            case ATHLETE -> 4;
            default -> 99;
        };
    }

    public void setName(String string) {
        this.name = string;
    }

    public void setEmail(String string) {
        this.email = string;
    }

    public void setPasswordHash(String encode) {
        this.passwordHash = encode;
    }

    private boolean ownsRole(PersonRole role) {
        return role != null
                && role.getPerson() != null
                && Objects.equals(role.getPerson().getId(), this.id);
    }

    private void ensureRoleDoesNotOverlap(PersonRole newRole) {
        boolean overlapsExistingRole = this.roles.stream()
                .filter(existing -> existing != newRole)
                .filter(existing -> existing.getRole() == newRole.getRole())
                .anyMatch(existing -> periodsOverlap(
                        existing.getStartDate(),
                        existing.getEndDate(),
                        newRole.getStartDate(),
                        newRole.getEndDate()));

        if (overlapsExistingRole) {
            throw new IllegalStateException("Person already has this role in an overlapping period.");
        }
    }

    private boolean periodsOverlap(
            LocalDate startA,
            LocalDate endA,
            LocalDate startB,
            LocalDate endB) {

        LocalDate effectiveEndA = endA != null ? endA : LocalDate.MAX;
        LocalDate effectiveEndB = endB != null ? endB : LocalDate.MAX;

        return !startA.isAfter(effectiveEndB)
                && !startB.isAfter(effectiveEndA);
    }
}