package com.sportsclub.identity.application;

import java.time.LocalDate;
import java.util.List;

import com.sportsclub.identity.domain.enums.Role;
import com.sportsclub.identity.dto.filter.PersonFilter;
import com.sportsclub.identity.dto.request.AlterPasswordRequest;
import com.sportsclub.identity.dto.request.AssignRoleRequest;
import com.sportsclub.identity.dto.request.CreatePersonRequest;
import com.sportsclub.identity.dto.request.SetPasswordByStaffRequest;
import com.sportsclub.identity.dto.request.TerminateRoleRequest;
import com.sportsclub.identity.dto.request.UpdatePersonRequest;
import com.sportsclub.identity.dto.response.AlterPasswordResponse;
import com.sportsclub.identity.dto.response.BooleanResponse;
import com.sportsclub.identity.dto.response.NotificationResponse;
import com.sportsclub.identity.dto.response.PersonResponse;
import com.sportsclub.identity.dto.response.PersonRoleResponse;
import com.sportsclub.identity.dto.response.ProfileDataResponse;

public interface SS1Facade {

    ProfileDataResponse getProfileData(Integer personId);

    List<PersonResponse> listPeople(PersonFilter filter);

    PersonResponse getPerson(Integer personId);

    PersonResponse createPerson(CreatePersonRequest request, Integer performedBy);

    void updatePerson(Integer personId, UpdatePersonRequest request, Integer performedBy);

    AlterPasswordResponse alterPassword(Integer personId, AlterPasswordRequest request, Integer performedBy);

    void setPasswordByStaff(Integer personId, SetPasswordByStaffRequest request, Integer performedBy);

    List<PersonRoleResponse> listActiveRoles(Integer personId, LocalDate onDate);

    PersonRoleResponse assignRole(Integer personId, AssignRoleRequest request, Integer performedBy);

    void terminateRole(Integer personRoleId, TerminateRoleRequest request, Integer performedBy);

    void makeRolePrimary(Integer personRoleId, Integer performedBy);

    BooleanResponse personHasActiveRole(Integer personId, Role role, LocalDate onDate);

    List<NotificationResponse> listNotifications(Integer personId, Boolean read);

    void markNotificationAsRead(Integer notificationId, Integer performedBy);

    void removeNotification(Integer notificationId, Integer performedBy);
}