package com.sportsclub.security.user;

import java.util.Collection;
import java.util.List;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class AuthenticatedUser implements UserDetails {

    private final Integer personId;
    private final String email;
    private final String passwordHash;
    private final String name;
    private final boolean active;
    private final List<String> roles;
    private final String mainRole;
    private final Collection<? extends GrantedAuthority> authorities;

    public AuthenticatedUser(
            Integer personId,
            String email,
            String passwordHash,
            String name,
            boolean active,
            List<String> roles,
            String mainRole,
            Collection<? extends GrantedAuthority> authorities) {

        this.personId = personId;
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
        this.active = active;
        this.roles = roles != null ? roles : List.of();
        this.mainRole = mainRole;
        this.authorities = authorities != null ? authorities : List.of();
    }

    public Integer getPersonId() {
        return personId;
    }

    public String getEmailValue() {
        return email;
    }

    public String getName() {
        return name;
    }

    public boolean isActiveUser() {
        return active;
    }

    public List<String> getRoles() {
        return roles;
    }

    public String getMainRole() {
        return mainRole;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return active;
    }

    @Override
    public boolean isAccountNonLocked() {
        return active;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return active;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }
}