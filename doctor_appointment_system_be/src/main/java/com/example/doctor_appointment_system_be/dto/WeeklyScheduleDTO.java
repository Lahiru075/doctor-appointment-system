package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import lombok.*;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WeeklyScheduleDTO {

    @Min(value = 15, message = "Slot duration must be at least 15 minutes")
    @Max(value = 60, message = "Slot duration cannot exceed 60 minutes (1 hour)")
    private int defaultSlotDuration;

    @NotEmpty(message = "Schedule days list cannot be empty")
    @Valid
    private List<DailyScheduleDTO> days;
}
