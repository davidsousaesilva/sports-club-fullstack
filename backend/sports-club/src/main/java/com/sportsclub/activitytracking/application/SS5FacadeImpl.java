package com.sportsclub.activitytracking.application;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.activities.domain.entities.Event;
import com.sportsclub.activities.domain.entities.Training;
import com.sportsclub.activities.repository.EventRepository;
import com.sportsclub.activities.repository.TrainingRepository;
import com.sportsclub.activitytracking.domain.entities.Attendance;
import com.sportsclub.activitytracking.domain.entities.Performance;
import com.sportsclub.activitytracking.dto.request.PerformanceItemRequest;
import com.sportsclub.activitytracking.dto.request.RegisterOrUpdateAttendanceRequest;
import com.sportsclub.activitytracking.dto.request.RegisterOrUpdatePerformancesRequest;
import com.sportsclub.activitytracking.dto.response.AggregatedPerformanceResponse;
import com.sportsclub.activitytracking.dto.response.AttendanceResponse;
import com.sportsclub.activitytracking.dto.response.AttendanceStatisticsResponse;
import com.sportsclub.activitytracking.dto.response.PerformanceResponse;
import com.sportsclub.activitytracking.dto.response.RecentAttendanceResponse;
import com.sportsclub.activitytracking.repository.AttendanceRepository;
import com.sportsclub.activitytracking.repository.PerformanceRepository;
import com.sportsclub.activitytracking.service.AttendanceRulesService;
import com.sportsclub.activitytracking.service.AttendanceStatisticsService;
import com.sportsclub.activitytracking.service.PerformanceAggregationService;
import com.sportsclub.activitytracking.service.PerformanceRulesService;
import com.sportsclub.activitytracking.service.SS5Mapper;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.repository.PersonRepository;
import com.sportsclub.sportscore.domain.entities.StatisticType;
import com.sportsclub.sportscore.repository.StatisticTypeRepository;
import com.sportsclub.teams.domain.entities.Team;
import com.sportsclub.teams.domain.enums.TeamRelation;
import com.sportsclub.teams.repository.TeamRepository;
import com.sportsclub.identity.domain.enums.NotificationType;
import com.sportsclub.identity.service.NotificationService;
import com.sportsclub.shared.application.VersionValidator;

@Service
@Transactional
public class SS5FacadeImpl implements SS5Facade {

        private final AttendanceRepository attendanceRepository;
        private final PerformanceRepository performanceRepository;
        private final PersonRepository personRepository;
        private final TeamRepository teamRepository;
        private final TrainingRepository trainingRepository;
        private final EventRepository eventRepository;
        private final StatisticTypeRepository statisticTypeRepository;
        private final SS5Mapper ss5Mapper;
        private final AttendanceRulesService attendanceRulesService;
        private final PerformanceRulesService performanceRulesService;
        private final AttendanceStatisticsService attendanceStatisticsService;
        private final PerformanceAggregationService performanceAggregationService;
        private final NotificationService notificationService;
        private final VersionValidator versionValidator;

        public SS5FacadeImpl(
                        AttendanceRepository attendanceRepository,
                        PerformanceRepository performanceRepository,
                        PersonRepository personRepository,
                        TeamRepository teamRepository,
                        TrainingRepository trainingRepository,
                        EventRepository eventRepository,
                        StatisticTypeRepository statisticTypeRepository,
                        SS5Mapper ss5Mapper,
                        AttendanceRulesService attendanceRulesService,
                        PerformanceRulesService performanceRulesService,
                        AttendanceStatisticsService attendanceStatisticsService,
                        PerformanceAggregationService performanceAggregationService,
                        NotificationService notificationService,
                        VersionValidator versionValidator) {
                this.attendanceRepository = attendanceRepository;
                this.performanceRepository = performanceRepository;
                this.personRepository = personRepository;
                this.teamRepository = teamRepository;
                this.trainingRepository = trainingRepository;
                this.eventRepository = eventRepository;
                this.statisticTypeRepository = statisticTypeRepository;
                this.ss5Mapper = ss5Mapper;
                this.attendanceRulesService = attendanceRulesService;
                this.performanceRulesService = performanceRulesService;
                this.attendanceStatisticsService = attendanceStatisticsService;
                this.performanceAggregationService = performanceAggregationService;
                this.notificationService = notificationService;
                this.versionValidator = versionValidator;
        }

        @Override
        @Transactional(readOnly = true)
        public List<AttendanceResponse> listTrainingAttendances(Integer trainingId) {
                getExistingTraining(trainingId);

                return attendanceRepository.findByTrainingIdOrderByAthleteNameAsc(trainingId).stream()
                                .map(ss5Mapper::toAttendanceResponse)
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<AttendanceResponse> listEventAttendances(Integer eventId) {
                getExistingEvent(eventId);

                return attendanceRepository.findByEventIdOrderByAthleteNameAsc(eventId).stream()
                                .map(ss5Mapper::toAttendanceResponse)
                                .toList();
        }

        @Override
        @Transactional(readOnly = true)
        public List<AttendanceResponse> listWeeklyFreeTrainingAttendances(Integer teamId, LocalDate on) {
                if (on == null) {
                        throw new IllegalArgumentException("Date is required.");
                }

                getExistingTeam(teamId);

                LocalDate startOfWeek = on.with(DayOfWeek.MONDAY);
                LocalDate endOfWeek = startOfWeek.plusWeeks(1);

                return attendanceRepository.findWeeklyFreeTrainingAttendances(teamId, startOfWeek, endOfWeek).stream()
                                .map(ss5Mapper::toAttendanceResponse)
                                .toList();
        }

        @Override
        public AttendanceResponse registerOrUpdateAttendance(
                        RegisterOrUpdateAttendanceRequest request,
                        Integer performedBy) {

                attendanceRulesService.validateContext(
                                request.trainingId(),
                                request.eventId(),
                                request.freeTraining(),
                                request.teamId());

                Person actor = getExistingPerson(performedBy);
                Person athlete = getExistingPerson(request.athleteId());
                Training training = request.trainingId() != null ? getExistingTraining(request.trainingId()) : null;
                Event event = request.eventId() != null ? getExistingEvent(request.eventId()) : null;
                Team team = request.teamId() != null ? getExistingTeam(request.teamId()) : null;

                attendanceRulesService.validateBusinessRules(request, training, event, team);

                LocalDate attendanceDate = Boolean.TRUE.equals(request.freeTraining())
                                ? request.attendanceDate()
                                : null;

                Attendance attendance = findExistingAttendance(
                                request.athleteId(),
                                request.trainingId(),
                                request.eventId(),
                                request.freeTraining(),
                                request.teamId(),
                                attendanceDate)
                                .map(existing -> {
                                        versionValidator.validate(request.version(), existing.getVersion());

                                        existing.update(
                                                        request.present(),
                                                        request.freeTraining(),
                                                        training,
                                                        event,
                                                        team,
                                                        attendanceDate,
                                                        actor);
                                        return existing;
                                })
                                .orElseGet(() -> attendanceRepository.save(new Attendance(
                                                request.present(),
                                                request.freeTraining(),
                                                training,
                                                event,
                                                athlete,
                                                team,
                                                attendanceDate,
                                                actor)));

                notifyAttendanceRegistered(attendance);

                return ss5Mapper.toAttendanceResponse(attendance);
        }



        @Override
        @Transactional(readOnly = true)
        public List<AggregatedPerformanceResponse> listTrainingPerformances(Integer trainingId) {
                getExistingTraining(trainingId);

                List<PerformanceResponse> responses = performanceRepository.findByTrainingIdOrdered(trainingId).stream()
                                .map(ss5Mapper::toPerformanceResponse)
                                .toList();

                return performanceAggregationService.aggregateByAthlete(responses);
        }

        @Override
        @Transactional(readOnly = true)
        public List<AggregatedPerformanceResponse> listEventPerformances(Integer eventId) {
                getExistingEvent(eventId);

                List<PerformanceResponse> responses = performanceRepository.findByEventIdOrdered(eventId).stream()
                                .map(ss5Mapper::toPerformanceResponse)
                                .toList();

                return performanceAggregationService.aggregateByAthlete(responses);
        }

        @Override
        public void registerOrUpdatePerformances(RegisterOrUpdatePerformancesRequest request, Integer performedBy) {
                performanceRulesService.validateContext(request.trainingId(), request.eventId());

                Person actor = getExistingPerson(performedBy);
                Person athlete = getExistingPerson(request.athleteId());
                Person coach = actor;
                Training training = request.trainingId() != null ? getExistingTraining(request.trainingId()) : null;
                Event event = request.eventId() != null ? getExistingEvent(request.eventId()) : null;

                for (PerformanceItemRequest item : request.performances()) {
                        String note = item.note() == null ? "" : item.note().trim();

                        StatisticType statisticType = getExistingStatisticType(item.statisticTypeId());

                        Performance performance = findExistingPerformance(
                                        request.athleteId(),
                                        item.statisticTypeId(),
                                        request.trainingId(),
                                        request.eventId())
                                        .map(existing -> {
                                                versionValidator.validate(item.version(), existing.getVersion());

                                                existing.update(
                                                                item.value(),
                                                                note,
                                                                statisticType,
                                                                coach,
                                                                training,
                                                                event,
                                                                actor);
                                                return existing;
                                        })
                                        .orElseGet(() -> performanceRepository.save(new Performance(
                                                        item.value(),
                                                        note,
                                                        statisticType,
                                                        athlete,
                                                        coach,
                                                        training,
                                                        event,
                                                        actor)));

                        notifyPerformanceRegistered(performance);
                }
        }

        @Override
        @Transactional(readOnly = true)
        public AttendanceStatisticsResponse calculateAttendanceStatistics() {
                long attendances = attendanceRepository.countByPresentTrue();
                long absences = attendanceRepository.countByPresentFalse();

                List<RecentAttendanceResponse> recentAttendances = attendanceRepository
                                .findTop10ByOrderByCreatedAtDesc()
                                .stream()
                                .map(ss5Mapper::toRecentAttendanceResponse)
                                .toList();

                return attendanceStatisticsService.build(attendances, absences, recentAttendances);
        }

        @Override
        @Transactional(readOnly = true)
        public AttendanceStatisticsResponse calculateCoachAttendanceStatistics(Integer coachId) {
                getExistingPerson(coachId);

                long attendances = attendanceRepository.countByCoachAndPresent(
                                coachId,
                                true,
                                TeamRelation.COACH);

                long absences = attendanceRepository.countByCoachAndPresent(
                                coachId,
                                false,
                                TeamRelation.COACH);

                List<RecentAttendanceResponse> recentAttendances = attendanceRepository
                                .findRecentAttendancesByCoach(
                                                coachId,
                                                TeamRelation.COACH,
                                                PageRequest.of(0, 10))
                                .stream()
                                .map(ss5Mapper::toRecentAttendanceResponse)
                                .toList();

                return attendanceStatisticsService.build(attendances, absences, recentAttendances);
        }

        private Optional<Attendance> findExistingAttendance(
                Integer athleteId,
                Integer trainingId,
                Integer eventId,
                Boolean freeTraining,
                Integer teamId,
                        LocalDate attendanceDate) {

                if (Boolean.TRUE.equals(freeTraining)) {
                        return attendanceRepository.findFreeTrainingAttendanceForDay(
                                        athleteId,
                                        teamId,
                                        attendanceDate);
                }

                if (trainingId != null) {
                        return attendanceRepository.findByAthleteIdAndTrainingId(athleteId, trainingId);
                }

                return attendanceRepository.findByAthleteIdAndEventId(athleteId, eventId);
        }


        private Optional<Performance> findExistingPerformance(
                        Integer athleteId,
                        Integer statisticTypeId,
                        Integer trainingId,
                        Integer eventId) {
                if (trainingId != null) {
                        return performanceRepository.findByAthleteIdAndStatisticTypeIdAndTrainingId(
                                        athleteId,
                                        statisticTypeId,
                                        trainingId);
                }

                return performanceRepository.findByAthleteIdAndStatisticTypeIdAndEventId(
                                athleteId,
                                statisticTypeId,
                                eventId);
        }

        private Training getExistingTraining(Integer trainingId) {
                return trainingRepository.findById(trainingId)
                                .orElseThrow(() -> new EntityNotFoundException("Training not found: " + trainingId));
        }

        private Event getExistingEvent(Integer eventId) {
                return eventRepository.findById(eventId)
                                .orElseThrow(() -> new EntityNotFoundException("Event not found: " + eventId));
        }

        private Team getExistingTeam(Integer teamId) {
                return teamRepository.findById(teamId)
                                .orElseThrow(() -> new EntityNotFoundException("Team not found: " + teamId));
        }

        private Person getExistingPerson(Integer personId) {
                return personRepository.findById(personId)
                                .orElseThrow(() -> new EntityNotFoundException("Person not found: " + personId));
        }

        private StatisticType getExistingStatisticType(Integer statisticTypeId) {
                return statisticTypeRepository.findById(statisticTypeId)
                                .orElseThrow(() -> new EntityNotFoundException(
                                                "Statistic type not found: " + statisticTypeId));
        }

        private void notifyAttendanceRegistered(Attendance attendance) {
                Person athlete = attendance.getAthlete();

                String activityDescription = resolveAttendanceActivityDescription(attendance);

                notificationService.send(
                                athlete,
                                NotificationType.ATTENDANCE_REGISTERED,
                                "Foi registada a tua presença em: " + activityDescription + ".");

                if (!attendance.isPresent() && attendance.getTraining() != null) {
                        notificationService.send(
                                        athlete,
                                        NotificationType.TRAINING_MISSED,
                                        "Foi registada uma falta tua no treino: "
                                                        + attendance.getTraining().getDescription()
                                                        + ".");
                }
        }

        private String resolveAttendanceActivityDescription(Attendance attendance) {
                if (attendance.getTraining() != null) {
                        return "treino " + attendance.getTraining().getDescription();
                }

                if (attendance.getEvent() != null) {
                        return "evento " + attendance.getEvent().getDescription();
                }

                return "atividade";
        }

        private void notifyPerformanceRegistered(Performance performance) {
                Person athlete = performance.getAthlete();

                if (performance.getTraining() != null) {
                        notificationService.send(
                                        athlete,
                                        NotificationType.TRAINING_PERFORMANCE,
                                        "Foi registada uma performance tua no treino "
                                                        + performance.getTraining().getDescription()
                                                        + ".");
                        return;
                }

                if (performance.getEvent() != null) {
                        notificationService.send(
                                        athlete,
                                        NotificationType.EVENT_PERFORMANCE,
                                        "Foi registada uma performance tua no evento "
                                                        + performance.getEvent().getDescription()
                                                        + ".");
                }
        }
}