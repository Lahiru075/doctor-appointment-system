package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}
