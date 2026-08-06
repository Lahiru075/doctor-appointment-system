package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    boolean existsByAppointmentId(Long id);
}
