package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {

}
