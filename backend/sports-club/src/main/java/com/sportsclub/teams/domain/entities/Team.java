package com.sportsclub.teams.domain.entities;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;
import com.sportsclub.sportscore.domain.entities.Modality;
import com.sportsclub.teams.domain.enums.TeamType;
import com.sportsclub.teams.domain.valueobjects.TeamData;

import jakarta.persistence.CascadeType;
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
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;

@Entity
@Table(name = "team")
public class Team extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "team_type", nullable = false, length = 30)
    private TeamType teamType;

    @Column(name = "season_year", nullable = false, length = 20)
    private String seasonYear;

    @Column(name = "active", nullable = false)
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "modality_id", nullable = false)
    private Modality modality;

    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, orphanRemoval = false)
    @OrderBy("startDate DESC")
    private List<TeamMember> members = new ArrayList<>();

    protected Team() {
    }

    public Team(String name, TeamType teamType, String seasonYear, boolean active, Modality modality) {
        validateName(name);
        validateSeasonYear(seasonYear);

        this.name = name;
        this.teamType = Objects.requireNonNull(teamType, "teamType cannot be null.");
        this.seasonYear = seasonYear;
        this.active = active;
        this.modality = Objects.requireNonNull(modality, "modality cannot be null.");
    }

    public void update(TeamData data, Person by) {
        Objects.requireNonNull(data, "data cannot be null.");
        validateName(data.name());
        validateSeasonYear(data.seasonYear());

        this.name = data.name();
        this.teamType = Objects.requireNonNull(data.teamType(), "teamType cannot be null.");
        this.seasonYear = data.seasonYear();
        this.active = data.active();
        this.modality = Objects.requireNonNull(data.modality(), "modality cannot be null.");
        touch(by);
    }

    public void addMember(TeamMember member, Person by) {
        Objects.requireNonNull(member, "member cannot be null.");

        if (!Objects.equals(member.getTeam(), this)) {
            throw new IllegalArgumentException("Member does not belong to this team.");
        }

        boolean alreadyExists = this.members.stream()
                .anyMatch(existing -> existing == member
                        || (existing.getId() != null && existing.getId().equals(member.getId())));

        if (alreadyExists) {
            return;
        }

        ensureNoActiveMembershipConflict(member);
        this.members.add(member);
        touch(by);
    }

    public void endMember(Integer teamMemberId, LocalDateTime endDate, Person by) {
        TeamMember member = this.members.stream()
                .filter(existing -> Objects.equals(existing.getId(), teamMemberId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Team member does not belong to this team."));

        member.endMembership(endDate, by);
        touch(by);
    }

    public List<TeamMember> getMembersActiveAt(LocalDateTime at) {
        LocalDateTime effectiveAt = at != null ? at : LocalDateTime.now();

        return this.members.stream()
                .filter(member -> member.isActiveAt(effectiveAt))
                .sorted(Comparator.comparing(TeamMember::getStartDate).reversed())
                .toList();
    }

    public List<TeamMember> getAthletesActiveAt(LocalDateTime at) {
        return getMembersActiveAt(at).stream()
                .filter(TeamMember::isAthlete)
                .toList();
    }

    public List<TeamMember> getCoachesActiveAt(LocalDateTime at) {
        return getMembersActiveAt(at).stream()
                .filter(TeamMember::isCoach)
                .toList();
    }

    private void ensureNoActiveMembershipConflict(TeamMember candidate) {
        boolean conflict = this.members.stream()
                .filter(existing -> Objects.equals(existing.getPerson().getId(), candidate.getPerson().getId()))
                .filter(existing -> existing.getRelationship() == candidate.getRelationship())
                .anyMatch(existing -> existing.isActiveAt(candidate.getStartDate()));

        if (conflict) {
            throw new IllegalStateException(
                    "There is already an active membership for this person with the same relationship in this team.");
        }
    }

    private void validateName(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("name cannot be blank.");
        }
    }

    private void validateSeasonYear(String value) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException("seasonYear cannot be blank.");
        }
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public TeamType getTeamType() {
        return teamType;
    }

    public String getSeasonYear() {
        return seasonYear;
    }

    public boolean isActive() {
        return active;
    }

    public Modality getModality() {
        return modality;
    }

    public List<TeamMember> getMembers() {
        return List.copyOf(members);
    }
}