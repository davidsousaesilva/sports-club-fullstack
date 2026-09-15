package com.sportsclub.activities.domain.entities;

import java.util.Objects;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.teams.domain.entities.Team;

import jakarta.persistence.*;

@Entity
@Table(name = "competition_team", uniqueConstraints = @UniqueConstraint(columnNames = { "competition_id", "team_id" }))
public class CompetitionTeam extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "note", length = 255)
    private String note;

    @Column(name = "final_result", length = 100)
    private String finalResult;

    @Column(name = "result_points")
    private Integer resultPoints;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "competition_id", nullable = false)
    private Competition competition;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;
    

    protected CompetitionTeam() {
    }

    public CompetitionTeam(Competition competition, Team team, Person by) {
        this.competition = Objects.requireNonNull(competition);
        this.team = Objects.requireNonNull(team);
        touch(by);
    }

    public void update(String note, String finalResult, Integer resultPoints, Person by) {
        this.note = note;
        this.finalResult = finalResult;
        this.resultPoints = resultPoints;
        touch(by);
    }

    public Integer getId() {
        return id;
    }

    public String getNote() {
        return note;
    }

    public String getFinalResult() {
        return finalResult;
    }

    public Integer getResultPoints() {
        return resultPoints;
    }

    public Competition getCompetition() {
        return competition;
    }

    public Team getTeam() {
        return team;
    }
}