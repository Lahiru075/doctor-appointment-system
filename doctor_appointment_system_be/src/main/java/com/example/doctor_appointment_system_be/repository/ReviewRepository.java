package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    boolean existsByAppointmentId(Long appointmentId);

    @Query("SELECT r FROM Review r " +
            "JOIN FETCH r.patient p " +
            "JOIN FETCH p.user u " +
            "WHERE r.doctor.id = :doctorId " +
            "ORDER BY r.createdAt DESC")
    List<Review> findReviewsByDoctorId(@Param("doctorId") Long doctorId);

    @Query("SELECT r FROM Review r " +
            "JOIN FETCH r.patient p " +
            "JOIN FETCH p.user u " +
            "WHERE r.doctor.user.id = :userId " +
            "ORDER BY r.createdAt DESC")
    List<Review> findReviewsByDoctorUserId(@Param("userId") Long userId);
}