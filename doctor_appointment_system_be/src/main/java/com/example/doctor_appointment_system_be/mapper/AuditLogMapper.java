package com.example.doctor_appointment_system_be.mapper;

import com.example.doctor_appointment_system_be.dto.AuditLogRequestDTO;
import com.example.doctor_appointment_system_be.dto.AuditLogResponseDTO;
import com.example.doctor_appointment_system_be.entity.AuditLog;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AuditLogMapper {
    AuditLog toEntity(AuditLogRequestDTO requestDTO);
    AuditLogResponseDTO toDTO(AuditLog auditLog);
    List<AuditLogResponseDTO> toDTOList(List<AuditLog> auditLogs);
}
