package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.AuditLogRequestDTO;
import com.example.doctor_appointment_system_be.dto.AuditLogResponseDTO;
import com.example.doctor_appointment_system_be.entity.AuditLog;
import com.example.doctor_appointment_system_be.enums.ActivityType;
import com.example.doctor_appointment_system_be.mapper.AuditLogMapper;
import com.example.doctor_appointment_system_be.repository.AuditLogRepository;
import com.example.doctor_appointment_system_be.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final AuditLogMapper auditLogMapper;

    @Override
    @Transactional
    public void logActivity(AuditLogRequestDTO requestDTO){
        try {
            AuditLog auditLog = auditLogMapper.toEntity(requestDTO);
            auditLogRepository.save(auditLog);

        } catch (Exception e) {

        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLogResponseDTO> getAllLogs() {
        return auditLogMapper.toDTOList(auditLogRepository.findAllByOrderByCreatedAtDesc());
    }
}
