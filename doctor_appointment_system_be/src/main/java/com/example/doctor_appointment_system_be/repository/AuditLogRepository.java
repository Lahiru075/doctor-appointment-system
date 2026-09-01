package com.example.doctor_appointment_system_be.repository;

import com.example.doctor_appointment_system_be.entity.AuditLog;
import com.example.doctor_appointment_system_be.enums.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByCreatedAtDesc();

    List<AuditLog> findByActivityTypeOrderByCreatedAtDesc(ActivityType activityType);

    @Query("SELECT a FROM AuditLog a WHERE " +
            "LOWER(a.action) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(a.actorName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "ORDER BY a.createdAt DESC")
    List<AuditLog> searchLogs(@Param("query") String query);
}
