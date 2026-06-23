package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {

    void deleteByDoctorId(Long doctorId);

    List<TimeSlot> findByDoctorIdAndDate(Long doctorId, LocalDate date);
}
