package com.sportsclub.teams.domain.entities;

import java.time.LocalDateTime;
import java.util.Objects;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.teams.domain.enums.TeamRelation;

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
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "team_member", uniqueConstraints = {
        @UniqueConstraint(name = "uk_team_member_team_person_relationship_start", columnNames = { "team_id",
                "person_id", "relationship", "start_date" })
})
public class TeamMember extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person person;

    @Enumerated(EnumType.STRING)
    @Column(name = "relationship", nullable = false, length = 30)
    private TeamRelation relationship;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    protected TeamMember() {
    }

    public TeamMember(Team team, Person person, TeamRelation relationship, LocalDateTime startDate, Person by) {
        this.team = Objects.requireNonNull(team, "team cannot be null.");
        this.person = Objects.requireNonNull(person, "person cannot be null.");
        this.relationship = Objects.requireNonNull(relationship, "relationship cannot be null.");
        this.startDate = Objects.requireNonNull(startDate, "startDate cannot be null.");
        validateDates();
        touch(by);
    }

    public boolean isAthlete() {
        return this.relationship == TeamRelation.ATHLETE;
    }

    public boolean isCoach() {
        return this.relationship == TeamRelation.COACH;
    }

    public boolean isActiveAt(LocalDateTime at) {
        LocalDateTime effectiveAt = at != null ? at : LocalDateTime.now();

        return !effectiveAt.isBefore(this.startDate)
                && (this.endDate == null || !effectiveAt.isAfter(this.endDate));
    }

    public void endMembership(LocalDateTime endDate, Person by) {
        Objects.requireNonNull(endDate, "endDate cannot be null.");

        if (this.endDate != null) {
            throw new IllegalStateException("Membership is already ended.");
        }

        if (endDate.isBefore(this.startDate)) {
            throw new IllegalArgumentException("endDate cannot be before startDate.");
        }

        this.endDate = endDate;
        touch(by);
    }

    private void validateDates() {
        if (this.startDate == null) {
            throw new IllegalArgumentException("startDate cannot be null.");
        }

        if (this.endDate != null && this.endDate.isBefore(this.startDate)) {
            throw new IllegalArgumentException("startDate must be before or equal to endDate.");
        }
    }

    public Integer getId() {
        return id;
    }

    public Team getTeam() {
        return team;
    }

    public Person getPerson() {
        return person;
    }

    public TeamRelation getRelationship() {
        return relationship;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }
}