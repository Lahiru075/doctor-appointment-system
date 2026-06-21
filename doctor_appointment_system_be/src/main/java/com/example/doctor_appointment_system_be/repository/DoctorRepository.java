package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    @Query("SELECT d FROM Doctor d JOIN FETCH d.user JOIN FETCH d.specialization")
    List<Doctor> findAllDoctors();
}
