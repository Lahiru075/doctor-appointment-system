package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.AuditLogRequestDTO;
import com.example.doctor_appointment_system_be.dto.AuditLogResponseDTO;
import com.example.doctor_appointment_system_be.enums.ActivityType;

import java.util.List;

public interface AuditLogService {
    void logActivity(AuditLogRequestDTO requestDTO);
    List<AuditLogResponseDTO> getAllLogs();
}
