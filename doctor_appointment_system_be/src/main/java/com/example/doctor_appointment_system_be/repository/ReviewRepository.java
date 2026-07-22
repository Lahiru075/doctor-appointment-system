package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsByAppointmentId(Long appointmentId);
}