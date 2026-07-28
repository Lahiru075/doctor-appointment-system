package com.example.doctor_appointment_system_be.controller;

import com.example.doctor_appointment_system_be.dto.AdminDashboardDTO;
import com.example.doctor_appointment_system_be.dto.ApiResponse;
import com.example.doctor_appointment_system_be.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardDTO>> getStats() {

        AdminDashboardDTO stats = dashboardService.getAdminDashboardStats();

        ApiResponse<AdminDashboardDTO> response = ApiResponse.<AdminDashboardDTO>builder()
                .success(true)
                .status(HttpStatus.OK.value())
                .message("Dashboard statistics retrieved successfully")
                .data(stats)
                .timestamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
