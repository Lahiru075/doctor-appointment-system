package com.example.doctor_appointment_system_be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyScheduleDTO {
    private String dayOfWeek;
    private List<TimeSlotDTO> slots;
}
