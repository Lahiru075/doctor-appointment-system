package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(@Param("username") String username);
}
