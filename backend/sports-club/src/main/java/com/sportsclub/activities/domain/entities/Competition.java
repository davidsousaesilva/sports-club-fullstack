package com.sportsclub.activities.domain.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

import com.sportsclub.activities.domain.valueobjects.CompetitionData;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.sportscore.domain.entities.Modality;

import jakarta.persistence.*;

@Entity
@Table(name = "competition")
public class Competition extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "registration_fee", precision = 10, scale = 2)
    private BigDecimal registrationFee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "modality_id", nullable = false)
    private Modality modality;

    @OneToMany(mappedBy = "competition")
    private java.util.List<CompetitionTeam> competitionTeams = new java.util.ArrayList<>();

    protected Competition() {
    }

    public Competition(CompetitionData data, Modality modality, Person by) {
        validate(data);
        this.name = data.name();
        this.description = data.description();
        this.startDate = data.startDate();
        this.endDate = data.endDate();
        this.registrationFee = data.registrationFee();
        this.modality = Objects.requireNonNull(modality);
        touch(by);
    }

    public boolean isActiveOn(LocalDate date) {
        Objects.requireNonNull(date);

        boolean started = !this.startDate.isAfter(date);
        boolean notEnded = this.endDate == null || !this.endDate.isBefore(date);

        return started && notEnded;
    }

    public void update(CompetitionData data, Modality modality, Person by) {
        validate(data);
        this.name = data.name();
        this.description = data.description();
        this.startDate = data.startDate();
        this.endDate = data.endDate();
        this.registrationFee = data.registrationFee();
        this.modality = Objects.requireNonNull(modality);
        touch(by);
    }

    private void validate(CompetitionData data) {
        Objects.requireNonNull(data, "Competition data cannot be null.");
        Objects.requireNonNull(data.name(), "Competition name cannot be null.");
        Objects.requireNonNull(data.description(), "Competition description cannot be null.");
        Objects.requireNonNull(data.startDate(), "Competition start date cannot be null.");

        if (data.endDate() != null && data.endDate().isBefore(data.startDate())) {
            throw new IllegalArgumentException("End date cannot be before start date.");
        }

        if (data.registrationFee() != null && data.registrationFee().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Registration fee cannot be negative.");
        }
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public BigDecimal getRegistrationFee() {
        return registrationFee;
    }

    public Modality getModality() {
        return modality;
    }

    public java.util.List<CompetitionTeam> getCompetitionTeams() {
        return java.util.List.copyOf(competitionTeams);
    }
}