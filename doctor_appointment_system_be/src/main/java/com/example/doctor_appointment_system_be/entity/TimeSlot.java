package com.example.doctor_appointment_system_be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "time_slots")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private boolean isBooked = false;

    // Many-to-one relationship

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // one-to-one relationship

    @OneToOne(mappedBy = "timeSlot", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Appointment appointment;
}
