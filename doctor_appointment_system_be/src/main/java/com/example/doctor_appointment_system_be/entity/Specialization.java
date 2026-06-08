package com.example.doctor_appointment_system_be.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "specializations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Specialization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    private String description;

    // One-to-many relationship
    @OneToMany(mappedBy = "specialization", cascade = CascadeType.ALL)
    private List<Doctor> doctors;
}