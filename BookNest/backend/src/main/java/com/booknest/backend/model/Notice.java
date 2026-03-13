package com.booknest.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "notices",
        indexes = {
                @Index(name = "idx_notices_created_at", columnList = "created_at"),
                @Index(name = "idx_notices_priority_created_at", columnList = "priority, created_at")
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private NoticePriority priority;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @Column(name = "is_important")
    private Boolean legacyImportant;

    @PrePersist
    private void onCreate() {
        NoticePriority resolvedPriority = getPriority();
        LocalDateTime now = LocalDateTime.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = createdAt;
        }

        priority = resolvedPriority;
        legacyImportant = resolvedPriority == NoticePriority.HIGH;
    }

    public NoticePriority getPriority() {
        return priority == null ? resolvePriorityFromLegacy() : priority;
    }

    public void setPriority(NoticePriority priority) {
        this.priority = priority == null ? resolvePriorityFromLegacy() : priority;
        this.legacyImportant = this.priority == NoticePriority.HIGH;
    }

    @JsonProperty("isImportant")
    public boolean isImportant() {
        return getPriority() == NoticePriority.HIGH;
    }

    @JsonProperty("isImportant")
    public void setImportant(boolean important) {
        setPriority(important ? NoticePriority.HIGH : NoticePriority.NORMAL);
    }

    public boolean needsSchemaBackfill() {
        return priority == null || updatedAt == null;
    }

    public void backfillSchemaFields() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }

        if (priority == null) {
            priority = resolvePriorityFromLegacy();
        }

        if (updatedAt == null) {
            updatedAt = createdAt;
        }

        legacyImportant = priority == NoticePriority.HIGH;
    }

    private NoticePriority resolvePriorityFromLegacy() {
        return Boolean.TRUE.equals(legacyImportant) ? NoticePriority.HIGH : NoticePriority.NORMAL;
    }
}

