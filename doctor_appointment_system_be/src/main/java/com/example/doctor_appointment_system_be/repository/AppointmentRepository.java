package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.dto.ChartDataDTO;
import com.example.doctor_appointment_system_be.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.doctor d " +
            "JOIN FETCH d.user du " +
            "JOIN FETCH d.specialization s " +
            "LEFT JOIN FETCH a.timeSlot t " +
            "JOIN a.patient p " +
            "JOIN p.user u " +
            "WHERE u.id = :userId " +
            "ORDER BY a.id DESC")
    List<Appointment> findAppointmentsByUserId(@Param("userId") Long userId);

    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.doctor d " +
            "JOIN FETCH d.user du " +
            "JOIN FETCH d.specialization s " +
            "JOIN FETCH a.timeSlot t " +
            "WHERE d.user.id = :userId " +
            "AND a.status = 'CONFIRMED' " +
            "ORDER BY a.id DESC")
    List<Appointment> findAppointmentsByDoctorUserId(@Param("userId") Long userId);

    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient p JOIN FETCH a.doctor d WHERE a.id = :id")
    Optional<Appointment> findByIdWithPatientAndDoctor(@Param("id") Long id);

    @Query("SELECT a FROM Appointment a " +
            "JOIN FETCH a.doctor d " +
            "JOIN FETCH d.user du " +
            "JOIN FETCH d.specialization s " +
            "LEFT JOIN FETCH a.timeSlot t " +
            "JOIN FETCH a.patient p " +
            "JOIN FETCH p.user pu " +
            "WHERE d.user.id = :userId " +
            "ORDER BY a.id DESC")
    List<Appointment> findAllDoctorAppointmentsHistory(@Param("userId") Long userId);

    @Query("SELECT new com.example.doctor_appointment_system_be.dto.ChartDataDTO(a.timeSlot.date, COUNT(a)) " +
            "FROM Appointment a " +
            "WHERE a.timeSlot.date BETWEEN :startDate AND :endDate " +
            "GROUP BY a.timeSlot.date " +
            "ORDER BY a.timeSlot.date ASC")
    List<ChartDataDTO> getAppointmentCountsByDate(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
}