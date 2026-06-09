package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(@Param("username") String username);

    boolean existsByEmail(String email);
}
