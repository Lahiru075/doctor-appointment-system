package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Specialization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecializationRepository extends JpaRepository<Specialization, Long> {
    boolean existsByName(String name);
}
