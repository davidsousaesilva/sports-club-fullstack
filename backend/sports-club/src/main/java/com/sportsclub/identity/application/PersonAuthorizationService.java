package com.sportsclub.identity.application;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.domain.entities.PersonRole;
import com.sportsclub.identity.domain.enums.Role;

@Service
public class PersonAuthorizationService {

    public void ensureCanManagePerson(Person actor, Person targetPerson) {
        validateActor(actor);

        if (isManager(actor)) {
            return;
        }

        if (isManager(targetPerson)) {
            throw new IllegalStateException("Employee cannot alter a manager.");
        }
    }

    public void ensureCanManageRole(Person actor, PersonRole targetRole) {
        validateActor(actor);

        if (isManager(actor)) {
            return;
        }

        if (targetRole.getRole() == Role.MANAGER) {
            throw new IllegalStateException("Employee cannot alter manager roles.");
        }

        if (isManager(targetRole.getPerson())) {
            throw new IllegalStateException("Employee cannot alter roles of a manager.");
        }
    }

    public void ensureCanAssignRole(Person actor, Person targetPerson, Role roleToAssign) {
        validateActor(actor);

        if (isManager(actor)) {
            return;
        }

        if (roleToAssign == Role.MANAGER) {
            throw new IllegalStateException("Employee cannot assign manager role.");
        }

        if (isManager(targetPerson)) {
            throw new IllegalStateException("Employee cannot alter roles of a manager.");
        }
    }

    private void validateActor(Person actor) {
        boolean authorized = isManager(actor) || isEmployee(actor);
        if (!authorized) {
            throw new IllegalStateException("Only manager or employee can perform this action.");
        }
    }

    private boolean isManager(Person person) {
        return person != null && person.hasActiveRole(Role.MANAGER, LocalDate.now());
    }

    private boolean isEmployee(Person person) {
        return person != null && person.hasActiveRole(Role.EMPLOYEE, LocalDate.now());
    }
}