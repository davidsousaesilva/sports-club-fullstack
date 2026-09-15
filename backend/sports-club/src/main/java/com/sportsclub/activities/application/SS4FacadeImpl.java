package com.sportsclub.activities.application;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.activities.domain.enums.TemporalStatus;
import com.sportsclub.activities.domain.entities.Competition;
import com.sportsclub.activities.domain.entities.CompetitionTeam;
import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.entities.EventTeam;
import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.activities.dto.filter.CompetitionFilter;
import com.sportsclub.activities.dto.filter.EventFilter;
import com.sportsclub.activities.dto.filter.TrainingFilter;
import com.sportsclub.activities.dto.request.CreateCompetitionRequest;
import com.sportsclub.activities.dto.request.CreateEventRequest;
import com.sportsclub.activities.dto.request.CreateTrainingRequest;
import com.sportsclub.activities.dto.request.EnrollTeamRequest;
import com.sportsclub.activities.dto.request.UpdateCompetitionRequest;
import com.sportsclub.activities.dto.request.UpdateCompetitionTeamRequest;
import com.sportsclub.activities.dto.request.UpdateEventRequest;
import com.sportsclub.activities.dto.request.UpdateEventTeamRequest;
import com.sportsclub.activities.dto.request.UpdateTrainingRequest;
import com.sportsclub.activities.dto.response.CompetitionResponse;
import com.sportsclub.activities.dto.response.CompetitionSummaryResponse;
import com.sportsclub.activities.dto.response.CompetitionTeamResponse;
import com.sportsclub.activities.dto.response.EventResponse;
import com.sportsclub.activities.dto.response.EventSummaryResponse;
import com.sportsclub.activities.dto.response.EventTeamResponse;
import com.sportsclub.activities.dto.response.RegistrationFeeResponse;
import com.sportsclub.activities.dto.response.TrainingResponse;
import com.sportsclub.activities.dto.response.TrainingSummaryResponse;
import com.sportsclub.activities.repository.CompetitionRepository;
import com.sportsclub.activities.repository.CompetitionSpecifications;
import com.sportsclub.activities.repository.CompetitionTeamRepository;
import com.sportsclub.activities.repository.EventRepository;
import com.sportsclub.activities.repository.EventSpecifications;
import com.sportsclub.activities.repository.EventTeamRepository;
import com.sportsclub.activities.repository.TrainingRepository;
import com.sportsclub.activities.repository.TrainingSpecifications;
import com.sportsclub.activities.service.CompetitionRulesService;
import com.sportsclub.activities.service.SS4FactoryService;
import com.sportsclub.activities.service.SS4Mapper;
import com.sportsclub.activitytracking.repository.AttendanceRepository;
import com.sportsclub.activitytracking.repository.PerformanceRepository;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.repository.PersonRepository;
import com.sportsclub.sportscore.domain.entities.Modality;
import com.sportsclub.sportscore.domain.entities.SportsComplex;
import com.sportsclub.sportscore.repository.ModalityRepository;
import com.sportsclub.sportscore.repository.SportsComplexRepository;
import com.sportsclub.teams.domain.entities.Team;
import com.sportsclub.teams.repository.TeamRepository;
import com.sportsclub.teams.service.SS3Mapper;
import com.sportsclub.finance.service.FeeGenerationService;
import com.sportsclub.teams.dto.response.TeamMemberResponse;
import com.sportsclub.sportscore.dto.response.StatisticTypeResponse;
import com.sportsclub.identity.domain.enums.NotificationType;
import com.sportsclub.identity.service.NotificationService;
import com.sportsclub.shared.application.VersionValidator;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import jakarta.persistence.EntityNotFoundException;

@Service
@Transactional
public class SS4FacadeImpl implements SS4Facade {

        private final CompetitionRepository competitionRepository;
        private final CompetitionTeamRepository competitionTeamRepository;
        private final EventRepository eventRepository;
        private final EventTeamRepository eventTeamRepository;
        private final TrainingRepository trainingRepository;
        private final PersonRepository personRepository;
        private final ModalityRepository modalityRepository;
        private final SportsComplexRepository sportsComplexRepository;
        private final TeamRepository teamRepository;
        private final SS4Mapper ss4Mapper;
        private final CompetitionRulesService competitionRulesService;
        private final SS4FactoryService ss4FactoryService;
        private final FeeGenerationService feeGenerationService;
        private final AttendanceRepository attendanceRepository;
        private final PerformanceRepository performanceRepository;
        private final SS3Mapper ss3Mapper;
        private final NotificationService notificationService;
        private final VersionValidator versionValidator;

        public SS4FacadeImpl(
                CompetitionRepository competitionRepository,
                CompetitionTeamRepository competitionTeamRepository,
                EventRepository eventRepository,
                EventTeamRepository eventTeamRepository,
                TrainingRepository trainingRepository,
                PersonRepository personRepository,
                ModalityRepository modalityRepository,
                SportsComplexRepository sportsComplexRepository,
                TeamRepository teamRepository,
                SS4Mapper ss4Mapper,
                CompetitionRulesService competitionRulesService,
                SS4FactoryService ss4FactoryService,
                FeeGenerationService feeGenerationService,
                AttendanceRepository attendanceRepository,
                PerformanceRepository performanceRepository,
                SS3Mapper ss3Mapper,
                NotificationService notificationService,
                VersionValidator versionValidator) {
        this.competitionRepository = competitionRepository;
        this.competitionTeamRepository = competitionTeamRepository;
        this.eventRepository = eventRepository;
        this.eventTeamRepository = eventTeamRepository;
        this.trainingRepository = trainingRepository;
        this.personRepository = personRepository;
        this.modalityRepository = modalityRepository;
        this.sportsComplexRepository = sportsComplexRepository;
        this.teamRepository = teamRepository;
        this.ss4Mapper = ss4Mapper;
        this.competitionRulesService = competitionRulesService;
        this.ss4FactoryService = ss4FactoryService;
        this.feeGenerationService = feeGenerationService;
        this.attendanceRepository = attendanceRepository;
        this.performanceRepository = performanceRepository;
        this.ss3Mapper = ss3Mapper;
        this.notificationService = notificationService;
        this.versionValidator = versionValidator;
        }

        @Override
        @Transactional(readOnly = true)
        public List<CompetitionSummaryResponse> listCompetitions(CompetitionFilter filter) {
                return competitionRepository.findAll(
                                CompetitionSpecifications.withFilters(
                                                filter.modalityId(),
                                                filter.temporalStatus() != null ? filter.temporalStatus() : null,
                                                filter.competitionNameOrDescriptionOrModality()))
                                .stream()
                                .map(competition -> ss4Mapper.toCompetitionSummaryResponse(
                                        competition,
                                        (int) competitionTeamRepository.countByCompetitionId(competition.getId()),
                                        (int) eventRepository.countByCompetitionId(competition.getId())))
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<CompetitionSummaryResponse> listAthleteCompetitions(CompetitionFilter filter, Integer athleteId) {
                return competitionRepository.findAll(
                                CompetitionSpecifications.forAthlete(
                                                athleteId,
                                                filter.modalityId(),
                                                filter.temporalStatus() != null ? filter.temporalStatus() : null,
                                                filter.competitionNameOrDescriptionOrModality()))
                                .stream()
                                .map(competition -> ss4Mapper.toCompetitionSummaryResponse(
                                                competition,
                                                (int) competitionTeamRepository.countByCompetitionId(competition.getId()),
                                                (int) eventRepository.countByCompetitionId(competition.getId())))
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<CompetitionSummaryResponse> listCoachCompetitions(CompetitionFilter filter, Integer coachId) {
                return competitionRepository.findAll(
                                CompetitionSpecifications.forCoach(
                                                coachId,
                                                filter.modalityId(),
                                                filter.temporalStatus() != null ? filter.temporalStatus() : null,
                                                filter.competitionNameOrDescriptionOrModality()))
                                .stream()
                                .map(competition -> ss4Mapper.toCompetitionSummaryResponse(
                                                competition,
                                                (int) competitionTeamRepository.countByCompetitionId(competition.getId()),
                                                (int) eventRepository.countByCompetitionId(competition.getId())))
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public CompetitionResponse getCompetition(Integer competitionId) {
                Competition competition = getExistingCompetition(competitionId);

                List<CompetitionTeam> teams = competitionTeamRepository
                                .findByCompetitionIdOrderByIdAsc(competitionId);

                List<EventSummaryResponse> events = eventRepository
                                .findByCompetitionIdOrderByDateAsc(competitionId)
                                .stream()
                                .map(this::buildEventSummaryResponse)
                                .toList();

                return ss4Mapper.toCompetitionResponse(competition, teams, events);
        }

        @Override
        public CompetitionResponse createCompetition(CreateCompetitionRequest request, Integer performedBy) {
                Modality modality = getExistingModality(request.modalityId());
                Person actor = getExistingPerson(performedBy);

                Competition competition = new Competition(
                                ss4FactoryService.toCompetitionData(request),
                                modality,
                                actor);

                Competition saved = competitionRepository.save(competition);
                return ss4Mapper.toCompetitionResponse(saved, List.of(), List.of());
        }

        @Override
        public void updateCompetition(Integer competitionId, UpdateCompetitionRequest request, Integer performedBy) {
                Competition competition = getExistingCompetition(competitionId);
                Modality modality = getExistingModality(request.modalityId());
                Person actor = getExistingPerson(performedBy);

                versionValidator.validate(request.version(), competition.getVersion());

                competition.update(
                        ss4FactoryService.toCompetitionData(request),
                        modality,
                        actor);
        }

        @Override
        public void deleteCompetition(Integer competitionId, Integer performedBy) {
                Competition competition = getExistingCompetition(competitionId);
                getExistingPerson(performedBy);

                competitionRulesService.validateDeletion(competitionId);

                competitionRepository.delete(competition);
        }

        @Override
        @Transactional(readOnly = true)
        public RegistrationFeeResponse getRegistrationFee(Integer competitionId) {
                Competition competition = getExistingCompetition(competitionId);
                return ss4Mapper.toRegistrationFeeResponse(competition);
        }

        @Override
        @Transactional(readOnly = true)
        public List<CompetitionTeamResponse> listCompetitionTeams(Integer competitionId) {
                getExistingCompetition(competitionId);

                return competitionTeamRepository.findByCompetitionIdOrderByIdAsc(competitionId).stream()
                                .map(ss4Mapper::toCompetitionTeamResponse)
                                .toList();
        }

        @Override
        public CompetitionTeamResponse enrollTeam(Integer competitionId, EnrollTeamRequest request,
                        Integer performedBy) {
                Competition competition = getExistingCompetition(competitionId);
                Team team = getExistingTeam(request.teamId());
                Person actor = getExistingPerson(performedBy);

                competitionRulesService.ensureTeamModalityMatchesCompetition(competition, team);
                competitionRulesService.validateTeamEnrollment(competitionId, request.teamId());

                CompetitionTeam competitionTeam = new CompetitionTeam(competition, team, actor);
                CompetitionTeam saved = competitionTeamRepository.save(competitionTeam);

                generateCompetitionFeesForTeamAthletes(saved, team, competition, actor);

                notifyAthletesRegisteredCompetition(team, competition);

                return ss4Mapper.toCompetitionTeamResponse(saved);
        }

        @Override
        public void unenrollTeam(Integer competitionId, Integer teamId, Integer performedBy) {
                getExistingCompetition(competitionId);
                getExistingPerson(performedBy);

                CompetitionTeam competitionTeam = competitionTeamRepository
                                .findByCompetitionIdAndTeamId(competitionId, teamId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Competition team not found for competition " + competitionId
                                                                + " and team " + teamId));

                competitionTeamRepository.delete(competitionTeam);
        }

        @Override
        public void updateCompetitionTeam(Integer competitionTeamId, UpdateCompetitionTeamRequest request,
                        Integer performedBy) {
                CompetitionTeam competitionTeam = getExistingCompetitionTeam(competitionTeamId);
                Person actor = getExistingPerson(performedBy);

                versionValidator.validate(request.version(), competitionTeam.getVersion());

                competitionTeam.update(
                        request.note(),
                        request.finalResult(),
                        request.resultPoints(),
                        actor);
        }

        @Override
        @Transactional(readOnly = true)
        public List<EventSummaryResponse> listEvents(EventFilter filter) {
                return eventRepository.findAll(
                                EventSpecifications.withFilters(
                                                filter.competitionId(),
                                                filter.status(),
                                                filter.eventNameOrDescriptionOrCompetition()))
                                .stream()
                                .filter(event -> matchesTemporalStatus(
                                                event.getDate(),
                                                event.getDuration(),
                                                filter.status()))
                                .map(this::buildEventSummaryResponse)
                                .toList();
        }


        @Override
        @Transactional(readOnly = true)
        public List<EventSummaryResponse> listAthleteEvents(EventFilter filter, Integer athleteId) {
                return eventRepository.findAll(
                                EventSpecifications.forAthlete(
                                                athleteId,
                                                filter.competitionId(),
                                                filter.status(),
                                                filter.eventNameOrDescriptionOrCompetition()))
                                .stream()
                                .filter(event -> matchesTemporalStatus(
                                                event.getDate(),
                                                event.getDuration(),
                                                filter.status()))
                                .map(this::buildEventSummaryResponse)
                                .toList();
        }


        @Override
        @Transactional(readOnly = true)
        public List<EventSummaryResponse> listCoachEvents(EventFilter filter, Integer coachId) {
                return eventRepository.findAll(
                                EventSpecifications.forCoach(
                                                coachId,
                                                filter.competitionId(),
                                                filter.status(),
                                                filter.eventNameOrDescriptionOrCompetition()))
                                .stream()
                                .filter(event -> matchesTemporalStatus(
                                                event.getDate(),
                                                event.getDuration(),
                                                filter.status()))
                                .map(this::buildEventSummaryResponse)
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<EventSummaryResponse> listCompetitionEvents(Integer competitionId) {
                getExistingCompetition(competitionId);

                return eventRepository.findByCompetitionIdOrderByDateAsc(competitionId).stream()
                                .map(this::buildEventSummaryResponse)
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public EventResponse getEvent(Integer eventId) {
                Event event = getExistingEvent(eventId);
                List<EventTeam> teams = eventTeamRepository.findByEventIdOrderByIdAsc(eventId);

                Map<Integer, List<TeamMemberResponse>> members = teams.stream()
                                .collect(java.util.stream.Collectors.toMap(
                                                eventTeam -> eventTeam.getTeam().getId(),
                                                eventTeam -> eventTeam.getTeam()
                                                                .getAthletesActiveAt(event.getDate())
                                                                .stream()
                                                                .map(ss3Mapper::toTeamMemberResponse)
                                                                .toList()));

                List<StatisticTypeResponse> statsTypes = event.getModality()
                                .getStatisticTypeEntities()
                                .stream()
                                .map(ss4Mapper::toStatisticTypeResponse)
                                .toList();

                return ss4Mapper.toEventResponse(event, teams, members, statsTypes);
        }

        @Override
        public EventResponse createEvent(CreateEventRequest request, Integer performedBy) {
                Modality modality = getExistingModality(request.modalityId());
                SportsComplex complex = request.complexId() != null ? getExistingSportsComplex(request.complexId())
                                : null;
                Competition competition = request.competitionId() != null
                                ? getExistingCompetition(request.competitionId())
                                : null;
                Person actor = getExistingPerson(performedBy);

                Event event = new Event(
                                ss4FactoryService.toEventData(request),
                                modality,
                                competition,
                                complex,
                                actor);

                Event saved = eventRepository.save(event);
                return ss4Mapper.toEventResponse(saved, List.of(), Map.of(), List.of());
        }

        @Override
        public void updateEvent(Integer eventId, UpdateEventRequest request, Integer performedBy) {
                Event event = getExistingEvent(eventId);
                Modality modality = getExistingModality(request.modalityId());
                SportsComplex complex = request.complexId() != null ? getExistingSportsComplex(request.complexId()) : null;
                Competition competition = request.competitionId() != null ? getExistingCompetition(request.competitionId()) : null;
                Person actor = getExistingPerson(performedBy);

                versionValidator.validate(request.version(), event.getVersion());

                event.update(
                        ss4FactoryService.toEventData(request),
                        modality,
                        competition,
                        complex,
                        actor);
        }

        @Override
        public void deleteEvent(Integer eventId, Integer performedBy) {
                Event event = getExistingEvent(eventId);
                getExistingPerson(performedBy);
                eventRepository.delete(event);
        }

        @Override
        public void updateEventTeam(Integer eventTeamId, UpdateEventTeamRequest request, Integer performedBy) {
                EventTeam eventTeam = getExistingEventTeam(eventTeamId);
                Person actor = getExistingPerson(performedBy);

                versionValidator.validate(request.version(), eventTeam.getVersion());

                eventTeam.update(
                        request.result(),
                        request.numericResult(),
                        actor);
        }

        @Override
        @Transactional(readOnly = true)
        public List<TrainingSummaryResponse> listTrainings(TrainingFilter filter) {
                return trainingRepository.findAll(
                                TrainingSpecifications.withFilters(
                                                filter.teamId(),
                                                filter.complexId(),
                                                filter.temporalStatus(),
                                                filter.trainingDescriptionOrTeam()))
                                .stream()
                                .filter(training -> matchesTemporalStatus(
                                                training.getDate(),
                                                training.getDuration(),
                                                filter.temporalStatus()))
                                .map(training -> ss4Mapper.toTrainingSummaryResponse(
                                                training,
                                                calculatePresentAthletesPercent(training),
                                                calculatePerformanceEntriesPercent(training)))
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<TrainingSummaryResponse> listAthleteTrainings(TrainingFilter filter, Integer athleteId) {
                return trainingRepository.findAll(
                                TrainingSpecifications.forAthlete(
                                                athleteId,
                                                filter.teamId(),
                                                filter.complexId(),
                                                filter.temporalStatus(),
                                                filter.trainingDescriptionOrTeam()))
                                .stream()
                                .filter(training -> matchesTemporalStatus(
                                                training.getDate(),
                                                training.getDuration(),
                                                filter.temporalStatus()))
                                .map(training -> ss4Mapper.toTrainingSummaryResponse(
                                                training,
                                                calculatePresentAthletesPercent(training),
                                                calculatePerformanceEntriesPercent(training)))
                                .toList();
        }


        @Override
        @Transactional(readOnly = true)
        public List<TrainingSummaryResponse> listCoachTrainings(TrainingFilter filter, Integer coachId) {
                return trainingRepository.findAll(
                                TrainingSpecifications.forCoach(
                                                coachId,
                                                filter.teamId(),
                                                filter.complexId(),
                                                filter.temporalStatus(),
                                                filter.trainingDescriptionOrTeam()))
                                .stream()
                                .filter(training -> matchesTemporalStatus(
                                                training.getDate(),
                                                training.getDuration(),
                                                filter.temporalStatus()))
                                .map(training -> ss4Mapper.toTrainingSummaryResponse(
                                                training,
                                                calculatePresentAthletesPercent(training),
                                                calculatePerformanceEntriesPercent(training)))
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public TrainingResponse getTraining(Integer trainingId) {
                Training training = getExistingTraining(trainingId);

                List<TeamMemberResponse> members = training.getTeam()
                                .getAthletesActiveAt(training.getDate())
                                .stream()
                                .map(ss3Mapper::toTeamMemberResponse)
                                .toList();

                List<StatisticTypeResponse> statsTypes = training.getTeam()
                                .getModality()
                                .getStatisticTypeEntities()
                                .stream()
                                .map(ss4Mapper::toStatisticTypeResponse)
                                .toList();

                return ss4Mapper.toTrainingResponse(training, members, statsTypes);
        }

        @Override
        public TrainingResponse createTraining(CreateTrainingRequest request, Integer performedBy) {
                Team team = getExistingTeam(request.teamId());
                SportsComplex complex = request.complexId() != null ? getExistingSportsComplex(request.complexId())
                                : null;
                Person actor = getExistingPerson(performedBy);

                Training training = new Training(
                                ss4FactoryService.toTrainingData(request),
                                team,
                                complex,
                                actor);

                Training saved = trainingRepository.save(training);

                notifyAthletesTrainingScheduled(team, saved);

                return ss4Mapper.toTrainingResponse(saved, List.of(), List.of());
        }

        @Override
        public void updateTraining(Integer trainingId, UpdateTrainingRequest request, Integer performedBy) {
                Training training = getExistingTraining(trainingId);
                Team team = getExistingTeam(request.teamId());
                SportsComplex complex = request.complexId() != null ? getExistingSportsComplex(request.complexId()) : null;
                Person actor = getExistingPerson(performedBy);

                versionValidator.validate(request.version(), training.getVersion());

                training.update(
                        ss4FactoryService.toTrainingData(request),
                        team,
                        complex,
                        actor);
        }

        @Override
        public void deleteTraining(Integer trainingId, Integer performedBy) {
                Training training = getExistingTraining(trainingId);
                getExistingPerson(performedBy);
                trainingRepository.delete(training);
        }

        private Competition getExistingCompetition(Integer competitionId) {
                return competitionRepository.findById(competitionId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Competition not found: " + competitionId));
        }

        private CompetitionTeam getExistingCompetitionTeam(Integer competitionTeamId) {
                return competitionTeamRepository.findById(competitionTeamId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Competition team not found: " + competitionTeamId));
        }

        private Event getExistingEvent(Integer eventId) {
                return eventRepository.findById(eventId)
                                .orElseThrow(() -> new EntityNotFoundException("Event not found: " + eventId));
        }

        private EventTeam getExistingEventTeam(Integer eventTeamId) {
                return eventTeamRepository.findById(eventTeamId)
                                .orElseThrow(() -> new EntityNotFoundException("Event team not found: " + eventTeamId));
        }

        private Training getExistingTraining(Integer trainingId) {
                return trainingRepository.findById(trainingId)
                                .orElseThrow(() -> new EntityNotFoundException("Training not found: " + trainingId));
        }

        private Person getExistingPerson(Integer personId) {
                return personRepository.findById(personId)
                                .orElseThrow(() -> new EntityNotFoundException("Person not found: " + personId));
        }

        private Modality getExistingModality(Integer modalityId) {
                return modalityRepository.findById(modalityId)
                                .orElseThrow(() -> new EntityNotFoundException("Modality not found: " + modalityId));
        }

        private SportsComplex getExistingSportsComplex(Integer complexId) {
                return sportsComplexRepository.findById(complexId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Sports complex not found: " + complexId));
        }

        private Team getExistingTeam(Integer teamId) {
                return teamRepository.findById(teamId)
                                .orElseThrow(() -> new EntityNotFoundException("Team not found: " + teamId));
        }

        @Override
        @Transactional(readOnly = true)
        public List<EventTeamResponse> listTeamsByEvent(Integer eventId) {
                getExistingEvent(eventId);

                return eventTeamRepository.findByEventIdOrderByIdAsc(eventId).stream()
                                .map(ss4Mapper::toEventTeamResponse)
                                .toList();
        }
        
        @Override
        public EventTeamResponse addTeamToEvent(Integer eventId, EnrollTeamRequest request, Integer performedBy) {
                Event event = getExistingEvent(eventId);
                Team team = getExistingTeam(request.teamId());
                Person actor = getExistingPerson(performedBy);

                ensureTeamModalityMatchesEvent(event, team);

                if (eventTeamRepository.existsByEventIdAndTeamId(eventId, request.teamId())) {
                        throw new IllegalStateException("Team is already associated with this event.");
                }

                EventTeam eventTeam = new EventTeam(event, team, actor);

                EventTeam saved = eventTeamRepository.save(eventTeam);

                notifyAthletesRegisteredEvent(team, event);

                return ss4Mapper.toEventTeamResponse(saved);
        }
        

        @Override
        public void removeTeamFromEvent(Integer eventId, Integer teamId, Integer performedBy) {
                getExistingEvent(eventId);
                getExistingTeam(teamId);

                EventTeam eventTeam = eventTeamRepository.findByEventIdAndTeamId(eventId, teamId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Team is not associated with this event."));

                eventTeamRepository.delete(eventTeam);
        }
        
        private void ensureTeamModalityMatchesEvent(Event event, Team team) {
                Integer eventModalityId = event.getModality().getId();
                Integer teamModalityId = team.getModality().getId();

                if (!eventModalityId.equals(teamModalityId)) {
                        throw new IllegalStateException("Team modality does not match event modality.");
                }
        }

        private void generateCompetitionFeesForTeamAthletes(
                CompetitionTeam competitionTeam,
                Team team,
                Competition competition,
                        Person actor) {

                if (competition.getRegistrationFee() == null
                                || competition.getRegistrationFee().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                        return;
                }

                LocalDateTime feeDueDate = competition.getStartDate().atStartOfDay();

                team.getAthletesActiveAt(LocalDateTime.now())
                                .forEach(member -> feeGenerationService.generateCompetitionFeeIfNeeded(
                                                member.getPerson(),
                                                competitionTeam,
                                                competition.getRegistrationFee(),
                                                feeDueDate,
                                                actor));
        }
        

        private BigDecimal calculatePresentAthletesPercent(Training training) {
                int totalAthletes = training.getTeam()
                        .getAthletesActiveAt(training.getDate())
                        .size();

                if (totalAthletes == 0) {
                        return BigDecimal.ZERO;
                }

                long presentCount = attendanceRepository.countByTrainingIdAndPresentTrue(training.getId());

                return BigDecimal.valueOf(presentCount)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(totalAthletes), 2, RoundingMode.HALF_UP);
        }

        private BigDecimal calculatePerformanceEntriesPercent(Training training) {
                int totalAthletes = training.getTeam()
                        .getAthletesActiveAt(training.getDate())
                        .size();

                if (totalAthletes == 0) {
                        return BigDecimal.ZERO;
                }

                long athletesWithPerformance = performanceRepository
                        .countDistinctAthletesByTrainingId(training.getId());

                return BigDecimal.valueOf(athletesWithPerformance)
                        .multiply(BigDecimal.valueOf(100))
                        .divide(BigDecimal.valueOf(totalAthletes), 2, RoundingMode.HALF_UP);
        }
        
        private BigDecimal calculatePresentAthletesPercent(Event event) {
                List<EventTeam> teams = eventTeamRepository.findByEventIdOrderByIdAsc(event.getId());

                int totalAthletes = teams.stream()
                                .map(EventTeam::getTeam)
                                .flatMap(team -> team.getAthletesActiveAt(event.getDate()).stream())
                                .map(member -> member.getPerson().getId())
                                .collect(java.util.stream.Collectors.toSet())
                                .size();

                if (totalAthletes == 0) {
                        return BigDecimal.ZERO;
                }

                long presentCount = attendanceRepository.countByEventIdAndPresentTrue(event.getId());

                return BigDecimal.valueOf(presentCount)
                                .multiply(BigDecimal.valueOf(100))
                                .divide(BigDecimal.valueOf(totalAthletes), 2, RoundingMode.HALF_UP);
        }

        private BigDecimal calculatePerformanceEntriesPercent(Event event) {
                List<EventTeam> teams = eventTeamRepository.findByEventIdOrderByIdAsc(event.getId());

                int totalAthletes = teams.stream()
                                .map(EventTeam::getTeam)
                                .flatMap(team -> team.getAthletesActiveAt(event.getDate()).stream())
                                .map(member -> member.getPerson().getId())
                                .collect(java.util.stream.Collectors.toSet())
                                .size();

                if (totalAthletes == 0) {
                        return BigDecimal.ZERO;
                }

                long athletesWithPerformance = performanceRepository
                                .countDistinctAthletesByEventId(event.getId());

                return BigDecimal.valueOf(athletesWithPerformance)
                                .multiply(BigDecimal.valueOf(100))
                                .divide(BigDecimal.valueOf(totalAthletes), 2, RoundingMode.HALF_UP);
        }

        private EventSummaryResponse buildEventSummaryResponse(Event event) {
                List<EventTeam> teams = eventTeamRepository.findByEventIdOrderByIdAsc(event.getId());

                return ss4Mapper.toEventSummaryResponse(
                                event,
                                teams,
                                calculatePresentAthletesPercent(event),
                                calculatePerformanceEntriesPercent(event));
        }

        private void notifyAthletesRegisteredCompetition(Team team, Competition competition) {
                team.getAthletesActiveAt(LocalDateTime.now())
                                .forEach(member -> notificationService.send(
                                                member.getPerson(),
                                                NotificationType.ATHLETE_REGISTERED_COMPETITION,
                                                "Foste inscrito na competição "
                                                                + competition.getName()
                                                                + " com a equipa "
                                                                + team.getName()
                                                                + "."));
        }

        private void notifyAthletesRegisteredEvent(Team team, Event event) {
                team.getAthletesActiveAt(event.getDate())
                                .forEach(member -> notificationService.send(
                                                member.getPerson(),
                                                NotificationType.ATHLETE_REGISTERED_EVENT,
                                                "Foste inscrito no evento "
                                                                + event.getDescription()
                                                                + " com a equipa "
                                                                + team.getName()
                                                                + "."));
        }

        private void notifyAthletesTrainingScheduled(Team team, Training training) {
                team.getAthletesActiveAt(training.getDate())
                                .forEach(member -> notificationService.send(
                                                member.getPerson(),
                                                NotificationType.TRAINING_SCHEDULED,
                                                "Foi marcado um treino da equipa "
                                                                + team.getName()
                                                                + " para "
                                                                + training.getDate()
                                                                + "."));
        }

        private void notifyAthletesCompetitionResult(CompetitionTeam competitionTeam) {
                Team team = competitionTeam.getTeam();
                Competition competition = competitionTeam.getCompetition();

                team.getAthletesActiveAt(LocalDateTime.now())
                                .forEach(member -> notificationService.send(
                                                member.getPerson(),
                                                NotificationType.COMPETITION_RESULT,
                                                "Foi registado o resultado da competição "
                                                                + competition.getName()
                                                                + " para a equipa "
                                                                + team.getName()
                                                                + ". Resultado: "
                                                                + competitionTeam.getFinalResult()
                                                                + "."));
        }

        private void notifyAthletesEventResult(EventTeam eventTeam) {
                Team team = eventTeam.getTeam();
                Event event = eventTeam.getEvent();

                team.getAthletesActiveAt(event.getDate())
                                .forEach(member -> notificationService.send(
                                                member.getPerson(),
                                                NotificationType.EVENT_RESULT,
                                                "Foi registado o resultado do evento "
                                                                + event.getDescription()
                                                                + " para a equipa "
                                                                + team.getName()
                                                                + ". Resultado: "
                                                                + eventTeam.getResult()
                                                                + "."));
        }
        
        private boolean matchesTemporalStatus(
                LocalDateTime start,
                Integer duration,
                        TemporalStatus temporalStatus) {
                if (temporalStatus == null) {
                        return true;
                }

                if (start == null) {
                        return false;
                }

                LocalDateTime now = LocalDateTime.now();
                LocalDateTime end = start.plusMinutes(duration != null ? duration : 0);

                return switch (temporalStatus) {
                        case FUTURE -> start.isAfter(now);
                        case PAST -> end.isBefore(now);
                        case IN_PROGRESS -> !start.isAfter(now) && !end.isBefore(now);
                };
        }

}