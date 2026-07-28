package com.example.doctor_appointment_system_be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ChartDataDTO {
    private LocalDate date;
    private long count;
}