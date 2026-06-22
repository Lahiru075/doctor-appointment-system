package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

    @Query("SELECT p FROM Patient p JOIN FETCH p.user u WHERE u.deleted = false")
    List<Patient> findAllActivePatients();
}
