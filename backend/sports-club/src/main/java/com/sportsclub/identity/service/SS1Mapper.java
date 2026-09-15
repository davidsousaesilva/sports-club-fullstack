package com.sportsclub.identity.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Component;

import com.sportsclub.identity.domain.entities.Notification;
import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.domain.entities.PersonRole;
import com.sportsclub.identity.dto.response.NotificationResponse;
import com.sportsclub.identity.dto.response.PersonResponse;
import com.sportsclub.identity.dto.response.PersonRoleResponse;

@Component
public class SS1Mapper {

        public PersonResponse toPersonResponse(Person person, LocalDate onDate) {
                List<PersonRoleResponse> activeRolesResponse = person.getRoles()
                                .stream()
                                .filter(role -> role.getEndDate() == null)
                                .map(this::toPersonRoleResponse)
                                .toList();

                List<PersonRoleResponse> roleHistoryResponse = person.getRoles()
                                .stream()
                                .map(this::toPersonRoleResponse)
                                .toList();

                return new PersonResponse(
                                person.getId(),
                                person.getVersion(),
                                person.getName(),
                                person.getGender(),
                                person.getEmail(),
                                person.getPhone(),
                                person.getAddress(),
                                person.getBirthDate(),
                                person.getEntryDate(),
                                person.hasCurrentRoles(),
                                activeRolesResponse,
                                roleHistoryResponse);
        }


    public PersonRoleResponse toPersonRoleResponse(PersonRole personRole) {
        return new PersonRoleResponse(
                personRole.getId(),
                personRole.getVersion(),
                personRole.getRole(),
                personRole.getStartDate(),
                personRole.getEndDate(),
                personRole.isPrimaryRole(),
                personRole.getEndJustification(),
                personRole.getPerson().getId());
    }

    public NotificationResponse toNotificationResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getType(),
                notification.getContent(),
                notification.isRead(),
                notification.getRecipient().getId());
    }
}