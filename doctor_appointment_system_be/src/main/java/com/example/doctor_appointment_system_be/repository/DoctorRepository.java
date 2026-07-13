package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.dto.DoctorSuggestionDTO;
import com.example.doctor_appointment_system_be.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    @Query("SELECT d FROM Doctor d JOIN FETCH d.user u JOIN FETCH d.specialization WHERE u.deleted = false")
    List<Doctor> findAllDoctors();

    Doctor findByUserId(Long userId);

    @Query("SELECT d FROM Doctor d \n" +
            "JOIN FETCH d.user u \n" +
            "JOIN FETCH d.specialization s \n" +
            "WHERE u.deleted = false \n" +
            "  AND (:name IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :name, '%'))) \n" +
            "  AND (:specializationId IS NULL OR s.id = :specializationId)")
    List<Doctor> searchDoctors(String name, Long specializationId);

    @Query("SELECT new com.example.doctor_appointment_system_be.dto.DoctorSuggestionDTO(d.id, u.fullName) " +
            "FROM Doctor d JOIN d.user u " +
            "WHERE u.deleted = false AND LOWER(u.fullName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<DoctorSuggestionDTO> findSuggestions(@Param("query") String query);
}
