package com.sportsclub.identity.domain.entities;

import java.time.LocalDate;
import java.util.Objects;

import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "person_role")
public class PersonRole extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "primary_role", nullable = false)
    private boolean primaryRole;

    @Column(name = "end_justification", columnDefinition = "TEXT")
    private String endJustification;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    protected PersonRole() {
    }

    public PersonRole(
            Role role,
            LocalDate startDate,
            LocalDate endDate,
            boolean primaryRole,
            String endJustification,
            Person person) {
        if (role == null) {
            throw new IllegalArgumentException("role cannot be null.");
        }

        if (startDate == null) {
            throw new IllegalArgumentException("startDate cannot be null.");
        }

        if (person == null) {
            throw new IllegalArgumentException("person cannot be null.");
        }

        if (endDate != null && endDate.isBefore(startDate)) {
            throw new IllegalArgumentException("endDate cannot be before startDate.");
        }

        this.role = role;
        this.startDate = startDate;
        this.endDate = endDate;
        this.primaryRole = primaryRole;
        this.endJustification = endJustification;
        this.person = person;
    }

    public void terminate(String justification, Person by) {
        if (this.endDate != null) {
            throw new IllegalStateException("Role is already terminated.");
        }

        this.endDate = LocalDate.now();
        this.endJustification = justification;
        this.primaryRole = false;
        touch(by);
    }

    public void makePrimary(Person by) {
        if (!isActive(LocalDate.now())) {
            throw new IllegalStateException("Only an active role can be set as primary.");
        }

        this.primaryRole = true;
        touch(by);
    }

    public void removeAsPrimary(Person by) {
        if (!this.primaryRole) {
            return;
        }

        this.primaryRole = false;
        touch(by);
    }

    public boolean isActive(LocalDate onDate) {
        LocalDate effectiveDate = onDate != null ? onDate : LocalDate.now();

        return !startDate.isAfter(effectiveDate)
                && (endDate == null || endDate.isAfter(effectiveDate));
    }

    public void setPerson(Person person) {
        if (person == null) {
            throw new IllegalArgumentException("person cannot be null.");
        }

        this.person = person;
    }

    public Integer getId() {
        return id;
    }

    public Role getRole() {
        return role;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public boolean isPrimaryRole() {
        return primaryRole;
    }

    public String getEndJustification() {
        return endJustification;
    }

    public Person getPerson() {
        return person;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PersonRole that)) {
            return false;
        }
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}