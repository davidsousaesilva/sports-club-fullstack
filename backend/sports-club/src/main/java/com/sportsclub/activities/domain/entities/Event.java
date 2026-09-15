package com.sportsclub.activities.domain.entities;

import java.time.LocalDateTime;
import java.util.Objects;

import com.sportsclub.activities.domain.valueobjects.EventData;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.sportscore.domain.entities.Modality;
import com.sportsclub.sportscore.domain.entities.SportsComplex;

import jakarta.persistence.*;

@Entity
@Table(name = "event")
public class Event extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "description", nullable = false, length = 255)
    private String description;

    @Column(name = "date", nullable = false)
    private LocalDateTime date;

    @Column(name = "duration", nullable = false)
    private int duration;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "modality_id", nullable = false)
    private Modality modality;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "competition_id")
    private Competition competition;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complex_id")
    private SportsComplex complex;

    @OneToMany(mappedBy = "event")
    private java.util.List<EventTeam> eventTeams = new java.util.ArrayList<>();

    protected Event() {
    }

    public Event(EventData data, Modality modality, Competition competition, SportsComplex complex, Person by) {
        validate(data);
        this.description = data.description();
        this.date = data.date();
        this.duration = data.duration();
        this.modality = Objects.requireNonNull(modality);
        this.competition = competition;
        this.complex = complex;
        touch(by);
    }

    public void update(EventData data, Modality modality, Competition competition, SportsComplex complex, Person by) {
        validate(data);
        this.description = data.description();
        this.date = data.date();
        this.duration = data.duration();
        this.modality = Objects.requireNonNull(modality);
        this.competition = competition;
        this.complex = complex;
        touch(by);
    }

    private void validate(EventData data) {
        Objects.requireNonNull(data, "Event data cannot be null.");
        Objects.requireNonNull(data.description(), "Event description cannot be null.");
        Objects.requireNonNull(data.date(), "Event date cannot be null.");

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

    public LocalDateTime getDate() {
        return date;
    }

    public int getDuration() {
        return duration;
    }

    public Modality getModality() {
        return modality;
    }

    public Competition getCompetition() {
        return competition;
    }

    public SportsComplex getComplex() {
        return complex;
    }

    public java.util.List<EventTeam> getEventTeams() {
        return java.util.List.copyOf(eventTeams);
    }
}