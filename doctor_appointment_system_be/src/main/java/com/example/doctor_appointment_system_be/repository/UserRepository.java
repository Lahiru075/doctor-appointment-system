package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Modifying
    @Query("UPDATE User u SET u.deleted = true WHERE u.id = (SELECT d.user.id FROM Doctor d WHERE d.id = :doctorId)")
    void softDeleteByDoctorId(@Param("doctorId") Long doctorId);

    @Modifying
    @Query("UPDATE User u SET u.isActive = CASE WHEN u.isActive = true THEN false ELSE true END " +
            "WHERE u.id = (SELECT d.user.id FROM Doctor d WHERE d.id = :doctorId)")
    void toggleActiveStatusByDoctorId(@Param("doctorId") Long doctorId);
    //CASE WHEN u.isActive = true THEN false ELSE true END = ( if isActive false.. it convert true.. if isActive true.. it convert false)
}
