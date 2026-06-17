package com.example.doctor_appointment_system_be.entity;

import com.example.doctor_appointment_system_be.enums.ActivityType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String event; // information like "New Patient registered"

    @Column(nullable = false)
    private String actor; // who is actor "Dave Henderson"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}