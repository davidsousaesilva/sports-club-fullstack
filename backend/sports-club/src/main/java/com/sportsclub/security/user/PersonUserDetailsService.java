package com.sportsclub.security.user;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sportsclub.identity.domain.entities.Person;
import com.sportsclub.identity.domain.entities.PersonRole;
import com.sportsclub.identity.repository.PersonRepository;

@Service
@Transactional(readOnly = true)
public class PersonUserDetailsService implements UserDetailsService {

        private final PersonRepository personRepository;

        public PersonUserDetailsService(PersonRepository personRepository) {
                this.personRepository = personRepository;
        }

        @Override
        public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

                Person person = personRepository.findByEmailIgnoreCase(email)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                "Person not found with email: " + email));

                if (!person.isActive()) {
                        throw new DisabledException("Person is inactive.");
                }

                LocalDate today = LocalDate.now();

                List<PersonRole> activeRoles = Optional.ofNullable(person.getActiveRoles(today))
                                .orElse(List.of());

                List<String> roleNames = activeRoles.stream()
                                .map(r -> r.getRole().name())
                                .toList();

                String mainRole = activeRoles.stream()
                                .filter(PersonRole::isPrimaryRole)
                                .findFirst()
                                .map(r -> r.getRole().name())
                                .orElseGet(() -> roleNames.isEmpty() ? null : roleNames.get(0));

                List<SimpleGrantedAuthority> authorities = activeRoles.stream()
                                .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getRole().name()))
                                .toList();

                return new AuthenticatedUser(
                                person.getId(),
                                person.getEmail(),
                                person.getPasswordHash(),
                                person.getName(),
                                person.isActive(),
                                roleNames,
                                mainRole,
                                authorities);
        }
}