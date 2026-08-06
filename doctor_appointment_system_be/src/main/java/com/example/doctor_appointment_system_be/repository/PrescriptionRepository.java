package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    boolean existsByAppointmentId(Long id);

    @Query("SELECT p FROM Prescription p " +
            "JOIN FETCH p.doctor d " +
            "JOIN FETCH d.user du " +
            "JOIN FETCH d.specialization s " +
            "JOIN FETCH p.appointment a " +
            "WHERE p.patient.user.id = :userId " +
            "ORDER BY p.createdAt DESC")
    List<Prescription> findByPatientUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Prescription p " +
            "JOIN FETCH p.doctor d " +
            "JOIN FETCH d.user du " +
            "JOIN FETCH d.specialization s " +
            "JOIN FETCH p.patient pat " +
            "JOIN FETCH pat.user pu " +
            "WHERE p.appointment.id = :appointmentId")
    Optional<Prescription> findByAppointmentIdWithDetails(@Param("appointmentId") Long appointmentId);
}
