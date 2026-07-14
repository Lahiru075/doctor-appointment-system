package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    void deleteByDoctorIdAndIsBookedFalse(Long id);

    boolean existsByDoctorIdAndDateAndStartTime(Long id, LocalDate date, LocalTime current);

    List<TimeSlot> findByDoctorIdAndDateGreaterThanEqual(Long id, LocalDate now);

    void deleteByIsBookedFalseAndDateLessThan(LocalDate date);

    @Query("SELECT t FROM TimeSlot t WHERE t.doctor.id = :doctorId " +
            "AND t.isBooked = false " +
            "AND t.date >= :today " +
            "ORDER BY t.date ASC, t.startTime ASC")
    List<TimeSlot> findAvailableSlots(
            @Param("doctorId") Long doctorId,
            @Param("today") LocalDate today
    );
}
