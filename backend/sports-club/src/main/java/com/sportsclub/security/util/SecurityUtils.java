package com.sportsclub.security.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.sportsclub.security.user.AuthenticatedUser;

public final class SecurityUtils {

    private SecurityUtils() {
    }

    public static Integer getAuthenticatedPersonId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new IllegalStateException("No authenticated user found.");
        }

        return user.getPersonId();
    }

    public static AuthenticatedUser getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !(authentication.getPrincipal() instanceof AuthenticatedUser user)) {
            throw new IllegalStateException("No authenticated user found.");
        }

        return user;
    }

    public static String getAuthenticatedEmail() {
        return getAuthenticatedUser().getEmailValue();
    }
}