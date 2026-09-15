package com.sportsclub.activities.domain.entities;

import java.util.Objects;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.teams.domain.entities.Team;

import jakarta.persistence.*;

@Entity
@Table(name = "event_team", uniqueConstraints = @UniqueConstraint(columnNames = { "event_id", "team_id" }))
public class EventTeam extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "result", length = 100)
    private String result;

    @Column(name = "numeric_result", length = 100)
    private String numericResult;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    protected EventTeam() {
    }

    public EventTeam(Event event, Team team, Person by) {
        this.event = Objects.requireNonNull(event);
        this.team = Objects.requireNonNull(team);
        touch(by);
    }

    public void update(String result, String numericResult, Person by) {
        this.result = result;
        this.numericResult = numericResult;
        touch(by);
    }

    public Integer getId() {
        return id;
    }

    public String getResult() {
        return result;
    }

    public String getNumericResult() {
        return numericResult;
    }

    public Event getEvent() {
        return event;
    }

    public Team getTeam() {
        return team;
    }
}