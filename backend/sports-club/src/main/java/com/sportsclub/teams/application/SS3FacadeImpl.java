package com.sportsclub.teams.application;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.identity.repository.PersonRepository;
import com.sportsclub.sportscore.domain.entities.Modality;
import com.sportsclub.sportscore.repository.ModalityRepository;
import com.sportsclub.teams.domain.entities.Team;
import com.sportsclub.teams.domain.entities.TeamMember;
import com.sportsclub.teams.domain.enums.TeamRelation;
import com.sportsclub.teams.domain.valueobjects.TeamData;
import com.sportsclub.teams.dto.filter.TeamFilter;
import com.sportsclub.teams.dto.request.AddTeamMemberRequest;
import com.sportsclub.teams.dto.request.CreateTeamRequest;
import com.sportsclub.teams.dto.request.EndMembershipRequest;
import com.sportsclub.teams.dto.request.UpdateTeamRequest;
import com.sportsclub.teams.dto.response.TeamMemberResponse;
import com.sportsclub.teams.dto.response.TeamResponse;
import com.sportsclub.teams.dto.response.TeamSummaryResponse;
import com.sportsclub.teams.repository.TeamMemberRepository;
import com.sportsclub.teams.repository.TeamRepository;
import com.sportsclub.teams.repository.TeamSpecifications;
import com.sportsclub.teams.service.SS3Mapper;
import com.sportsclub.teams.service.TeamRulesService;
import com.sportsclub.finance.service.FeeGenerationService;
import com.sportsclub.identity.domain.enums.NotificationType;
import com.sportsclub.identity.service.NotificationService;
import com.sportsclub.shared.application.VersionValidator;

@Service
@Transactional
public class SS3FacadeImpl implements SS3Facade {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final ModalityRepository modalityRepository;
    private final PersonRepository personRepository;
    private final SS3Mapper ss3Mapper;
    private final TeamRulesService teamRulesService;
    private final FeeGenerationService feeGenerationService;
    private final NotificationService notificationService;
    private final VersionValidator versionValidator;

    public SS3FacadeImpl(
            TeamRepository teamRepository,
            TeamMemberRepository teamMemberRepository,
            ModalityRepository modalityRepository,
            PersonRepository personRepository,
            SS3Mapper ss3Mapper,
            TeamRulesService teamRulesService,
            FeeGenerationService feeGenerationService,
            NotificationService notificationService,
            VersionValidator versionValidator) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.modalityRepository = modalityRepository;
        this.personRepository = personRepository;
        this.ss3Mapper = ss3Mapper;
        this.teamRulesService = teamRulesService;
        this.feeGenerationService = feeGenerationService;
        this.notificationService = notificationService;
        this.versionValidator = versionValidator;
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamSummaryResponse> listTeams(TeamFilter filter) {
        return teamRepository.findAll(TeamSpecifications.withFilter(filter)).stream()
                .map(ss3Mapper::toTeamSummaryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TeamResponse getTeam(Integer teamId) {
        Team team = getExistingTeam(teamId);
        return ss3Mapper.toTeamResponse(team);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamSummaryResponse> listCoachTeams(Integer coachId, TeamFilter filter) {
        Person coach = getExistingPerson(coachId);
        teamRulesService.ensurePersonHasRole(coach, Role.COACH);

        return teamRepository.findAll(TeamSpecifications.withCoachAndFilter(coachId, filter)).stream()
                .map(ss3Mapper::toTeamSummaryResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamSummaryResponse> listAthleteTeams(Integer athleteId, TeamFilter filter) {
        Person athlete = getExistingPerson(athleteId);
        teamRulesService.ensurePersonHasRole(athlete, Role.ATHLETE);

        return teamRepository.findAll(TeamSpecifications.withAthleteAndFilter(athleteId, filter)).stream()
                .map(ss3Mapper::toTeamSummaryResponse)
                .toList();
    }

    @Override
    public TeamResponse createTeam(CreateTeamRequest request, Integer performedBy) {
        Person actor = getExistingPerson(performedBy);
        Modality modality = getExistingModality(request.modalityId());

        teamRulesService.validateUniqueTeam(null, request.name(), request.seasonYear(), request.modalityId());

        Team team = new Team(
                request.name(),
                request.teamType(),
                request.seasonYear(),
                request.active(),
                modality);

        team.touch(actor);

        Team saved = teamRepository.save(team);
        return ss3Mapper.toTeamResponse(saved);
    }

    @Override
    public void updateTeam(Integer teamId, UpdateTeamRequest request, Integer performedBy) {
        Team team = getExistingTeam(teamId);
        Person actor = getExistingPerson(performedBy);
        Modality modality = getExistingModality(request.modalityId());

        versionValidator.validate(request.version(), team.getVersion());

        teamRulesService.validateUniqueTeam(teamId, request.name(), request.seasonYear(), request.modalityId());

        team.update(
                new TeamData(
                        request.name(),
                        request.teamType(),
                        request.seasonYear(),
                        request.active(),
                        modality),
                actor);
    }

    @Override
    public TeamMemberResponse addAthlete(Integer teamId, AddTeamMemberRequest request, Integer performedBy) {
        Team team = getExistingTeam(teamId);
        Person actor = getExistingPerson(performedBy);
        Person athlete = getExistingPerson(request.personId());

        teamRulesService.ensurePersonHasRole(athlete, Role.ATHLETE);
        teamRulesService.ensureNoActiveMembership(teamId, request.personId(), TeamRelation.ATHLETE);

        TeamMember member = new TeamMember(
                team,
                athlete,
                TeamRelation.ATHLETE,
                request.startDate(),
                athlete);

        team.addMember(member, actor);
        TeamMember saved = teamMemberRepository.save(member);

        feeGenerationService.generateFeesForTeamAthleteRegistration(
                athlete,
                team,
                request.startDate(),
                actor);

        notificationService.send(
                athlete,
                NotificationType.ATHLETE_REGISTERED_TEAM,
                "Foste inscrito na equipa " + team.getName()
                        + " da modalidade " + team.getModality().getName() + ".");

        return ss3Mapper.toTeamMemberResponse(saved);
    }

    @Override
    public TeamMemberResponse addCoach(Integer teamId, AddTeamMemberRequest request, Integer performedBy) {
        Team team = getExistingTeam(teamId);
        Person actor = getExistingPerson(performedBy);
        Person person = getExistingPerson(request.personId());

        teamRulesService.ensurePersonHasRole(person, Role.COACH);
        teamRulesService.ensureNoActiveMembership(teamId, request.personId(), TeamRelation.COACH);

        TeamMember member = new TeamMember(
                team,
                person,
                TeamRelation.COACH,
                request.startDate(),
                person);

        team.addMember(member, actor);
        TeamMember saved = teamMemberRepository.save(member);

        return ss3Mapper.toTeamMemberResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> listAthletesAt(Integer teamId, LocalDateTime at) {
        Team team = getExistingTeam(teamId);
        LocalDateTime effectiveAt = at != null ? at : LocalDateTime.now();

        return team.getAthletesActiveAt(effectiveAt).stream()
                .map(ss3Mapper::toTeamMemberResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeamMemberResponse> listCoachesAt(Integer teamId, LocalDateTime at) {
        Team team = getExistingTeam(teamId);
        LocalDateTime effectiveAt = at != null ? at : LocalDateTime.now();

        return team.getCoachesActiveAt(effectiveAt).stream()
                .map(ss3Mapper::toTeamMemberResponse)
                .toList();
    }

    @Override
    public void endMembership(Integer teamMemberId, EndMembershipRequest request, Integer performedBy) {
        TeamMember member = getExistingTeamMember(teamMemberId);
        Person actor = getExistingPerson(performedBy);

        versionValidator.validate(request.version(), member.getVersion());

        member.getTeam().endMember(teamMemberId, request.endDate(), actor);
    }

    private Team getExistingTeam(Integer teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Team not found: " + teamId));
    }

    private TeamMember getExistingTeamMember(Integer teamMemberId) {
        return teamMemberRepository.findById(teamMemberId)
                .orElseThrow(() -> new EntityNotFoundException("Team member not found: " + teamMemberId));
    }

    private Modality getExistingModality(Integer modalityId) {
        return modalityRepository.findById(modalityId)
                .orElseThrow(() -> new EntityNotFoundException("Modality not found: " + modalityId));
    }

    private Person getExistingPerson(Integer personId) {
        return personRepository.findById(personId)
                .orElseThrow(() -> new EntityNotFoundException("Person not found: " + personId));
    }
}