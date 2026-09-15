package com.sportsclub.activities.domain.entities;

import java.time.LocalDateTime;
import java.util.Objects;

import com.sportsclub.activities.domain.valueobjects.TrainingData;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.sportscore.domain.entities.SportsComplex;
import com.sportsclub.teams.domain.entities.Team;

import jakarta.persistence.*;

@Entity
@Table(name = "training")
public class Training extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "note", length = 255)
    private String note;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "duration", nullable = false)
    private int duration;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complex_id")
    private SportsComplex complex;

    protected Training() {
    }

    public Training(TrainingData data, Team team, SportsComplex complex, Person by) {
        validate(data);
        this.description = data.description();
        this.note = data.note();
        this.date = data.date();
        this.duration = data.duration();
        this.team = Objects.requireNonNull(team);
        this.complex = complex;
        touch(by);
    }

    public void update(TrainingData data, Team team, SportsComplex complex, Person by) {
        validate(data);
        this.description = data.description();
        this.note = data.note();
        this.date = data.date();
        this.duration = data.duration();
        this.team = Objects.requireNonNull(team);
        this.complex = complex;
        touch(by);
    }

    private void validate(TrainingData data) {
        Objects.requireNonNull(data, "Training data cannot be null.");
        Objects.requireNonNull(data.description(), "Training description cannot be null.");
        Objects.requireNonNull(data.date(), "Training date cannot be null.");

        if (data.duration() <= 0) {
            throw new IllegalArgumentException("Duration must be greater than zero.");
        }
    }

    public Integer getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getNote() {
        return note;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public int getDuration() {
        return duration;
    }

    public Team getTeam() {
        return team;
    }

    public SportsComplex getComplex() {
        return complex;
    }
}