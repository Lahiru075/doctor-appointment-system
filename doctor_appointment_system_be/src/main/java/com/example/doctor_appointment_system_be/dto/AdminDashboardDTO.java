package com.example.doctor_appointment_system_be.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AdminDashboardDTO {
    private long totalDoctors;
    private long totalPatients;
    private long totalSpecializations;
    private long totalAppointments;
    private List<ChartDataDTO> appointmentTrends;
}