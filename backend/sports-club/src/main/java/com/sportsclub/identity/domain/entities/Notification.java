package com.sportsclub.identity.domain.entities;

import java.util.Objects;

import com.sportsclub.identity.domain.enums.NotificationType;
import com.sportsclub.shared.domain.entities.PersonAuditableEntity;

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
import jakarta.persistence.Table;

@Entity
@Table(name = "notification")
public class Notification extends PersonAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 100)
    private NotificationType type;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "read", nullable = false)
    private boolean read = false;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "person_id", nullable = false)
    private Person recipient;

    protected Notification() {
    }

    public Notification(NotificationType type, String content, Person recipient) {
        this.type = Objects.requireNonNull(type, "type cannot be null.");
        this.content = Objects.requireNonNull(content, "content cannot be null.");
        this.recipient = Objects.requireNonNull(recipient, "recipient cannot be null.");
    }

    public void markAsRead(Person by) {
        if (this.read) {
            return;
        }

        this.read = true;
        touch(by);
    }

    public void markAsReadBy(Person actor) {
        ensureRecipient(actor);
        markAsRead(actor);
    }

    public void ensureCanBeRemovedBy(Person actor) {
        ensureRecipient(actor);
    }

    private void ensureRecipient(Person actor) {
        if (actor == null || actor.getId() == null) {
            throw new SecurityException("Invalid actor.");
        }

        if (this.recipient == null || this.recipient.getId() == null) {
            throw new IllegalStateException("Notification recipient is not defined.");
        }

        if (!Objects.equals(this.recipient.getId(), actor.getId())) {
            throw new SecurityException("Only the recipient can perform this action.");
        }
    }

    public Integer getId() {
        return id;
    }

    public NotificationType getType() {
        return type;
    }

    public String getContent() {
        return content;
    }

    public boolean isRead() {
        return read;
    }

    public Person getRecipient() {
        return recipient;
    }
}