package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.doctor d " +
            "JOIN FETCH d.user du " +
            "JOIN FETCH d.specialization s " +
            "JOIN FETCH a.timeSlot t " +
            "WHERE a.patient.user.id = :userId " +
            "ORDER BY t.date DESC, t.startTime DESC") // new data to top
    List<Appointment> findAppointmentsByUserId(@Param("userId") Long userId);

}
