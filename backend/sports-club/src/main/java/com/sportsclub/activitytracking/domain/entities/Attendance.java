package com.sportsclub.activitytracking.domain.entities;

import java.time.LocalDate;

import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.teams.domain.entities.Team;

import jakarta.persistence.*;

@Entity
@Table(name = "attendance")
public class Attendance extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private boolean present;

    @Column(name = "free_training", nullable = false)
    private boolean freeTraining;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "training_id")
    private Training training;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id")
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "athlete_id", nullable = false)
    private Person athlete;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;

    @Column(name = "attendance_date")
    private LocalDate attendanceDate;

    protected Attendance() {
    }

    public Attendance(
            boolean present,
            boolean freeTraining,
            Training training,
            Event event,
            Person athlete,
            Team team,
            LocalDate attendanceDate,
            Person by) {
        this.present = present;
        this.freeTraining = freeTraining;
        this.training = training;
        this.event = event;
        this.athlete = athlete;
        this.team = team;
        this.attendanceDate = attendanceDate;
        validate();
        touch(by);
    }

    public void update(
            boolean present,
            boolean freeTraining,
            Training training,
            Event event,
            Team team,
            LocalDate attendanceDate,
            Person actor) {
        this.present = present;
        this.freeTraining = freeTraining;
        this.training = training;
        this.event = event;
        this.team = team;
        this.attendanceDate = attendanceDate;
        validate();
        touch(actor);
    }

    public boolean refersToTraining() {
        return training != null && !freeTraining;
    }

    public boolean refersToFreeTraining() {
        return freeTraining && training == null && event == null && team != null;
    }

    public boolean refersToEvent() {
        return event != null;
    }

    private void validate() {
        boolean hasTraining = training != null;
        boolean hasEvent = event != null;
        boolean hasTeam = team != null;

        if (athlete == null) {
            throw new IllegalStateException("Attendance must have an athlete.");
        }

        if (freeTraining) {
            if (hasTraining || hasEvent) {
                throw new IllegalStateException("Free training attendance cannot refer to a training or event.");
            }

            if (!hasTeam) {
                throw new IllegalStateException("Free training attendance must have a team.");
            }

            if (attendanceDate == null) {
                throw new IllegalStateException("Free training attendance must have an attendance date.");
            }

            return;
        }

        if (attendanceDate != null) {
            throw new IllegalStateException("Only free training attendance can have an attendance date.");
        }

        if (hasTraining == hasEvent) {
            throw new IllegalStateException("Attendance must refer to exactly one context: training or event.");
        }

        if (hasEvent && hasTeam) {
            throw new IllegalStateException("Attendance in event context cannot have a team.");
        }
    }


    public Integer getId() {
        return id;
    }

    public boolean isPresent() {
        return present;
    }

    public boolean isFreeTraining() {
        return freeTraining;
    }

    public Training getTraining() {
        return training;
    }

    public Event getEvent() {
        return event;
    }

    public Person getAthlete() {
        return athlete;
    }

    public Team getTeam() {
        return team;
    }

    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

}