package com.example.doctor_appointment_system_be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer rating;

    private String comment;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // one-to-one relationships

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    // many-to-one relationships

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;
}
