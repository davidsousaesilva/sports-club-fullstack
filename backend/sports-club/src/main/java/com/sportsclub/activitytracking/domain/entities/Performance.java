package com.sportsclub.activitytracking.domain.entities;

import java.math.BigDecimal;

import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.sportscore.domain.entities.StatisticType;

import jakarta.persistence.*;

@Entity
@Table(name = "performance")
public class Performance extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal value;

    @Column(length = 1000)
    private String note;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "statistic_type_id", nullable = false)
    private StatisticType statisticType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Person athlete;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coach_id", nullable = false)
    private Person coach;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id")
    private Training training;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    protected Performance() {
    }

    public Performance(
            BigDecimal value,
            String note,
            StatisticType statisticType,
            Person athlete,
            Person coach,
            Training training,
            Event event,
            Person by) {
        this.value = value;
        this.note = note;
        this.statisticType = statisticType;
        this.athlete = athlete;
        this.coach = coach;
        this.training = training;
        this.event = event;
        validate();
        touch(by);
    }

    public void update(
            BigDecimal value,
            String note,
            StatisticType statisticType,
            Person coach,
            Training training,
            Event event,
            Person actor) {
        this.value = value;
        this.note = note;
        this.statisticType = statisticType;
        this.coach = coach;
        this.training = training;
        this.event = event;
        validate();
        touch(actor);
    }

    public boolean refersToTraining() {
        return training != null;
    }

    public boolean refersToEvent() {
        return event != null;
    }

    private void validate() {
        boolean hasTraining = training != null;
        boolean hasEvent = event != null;

        if (hasTraining == hasEvent) {
            throw new IllegalStateException("Performance must refer to exactly one context: training or event.");
        }

        if (value == null) {
            throw new IllegalStateException("Performance value is required.");
        }

        if (statisticType == null) {
            throw new IllegalStateException("Performance must have a statistic type.");
        }

        if (athlete == null) {
            throw new IllegalStateException("Performance must have an athlete.");
        }

        if (coach == null) {
            throw new IllegalStateException("Performance must have a coach.");
        }
    }

    public Integer getId() {
        return id;
    }

    public BigDecimal getValue() {
        return value;
    }

    public String getNote() {
        return note;
    }

    public StatisticType getStatisticType() {
        return statisticType;
    }

    public Person getAthlete() {
        return athlete;
    }

    public Person getCoach() {
        return coach;
    }

    public Training getTraining() {
        return training;
    }

    public Event getEvent() {
        return event;
    }
}