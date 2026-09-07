package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.dto.AuditLogResponseDTO;
import com.example.doctor_appointment_system_be.enums.ActivityType;
import com.example.doctor_appointment_system_be.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuditLogResponseDTO>>> getAllLogs() {
        System.out.println("enw1");
        List<AuditLogResponseDTO> logs = auditLogService.getAllLogs();

        System.out.println("enw2");

        ApiResponse<List<AuditLogResponseDTO>> response = ApiResponse.<List<AuditLogResponseDTO>>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Audit logs fetched successfully")
                .data(logs)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.ok(response);
    }
}
