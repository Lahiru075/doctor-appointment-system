package com.example.doctor_appointment_system_be.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
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

    @NotBlank(message = "Day of week is required")
    @Pattern(
            regexp = "^(MONDAY|TUESDAY|WEDNESDAY|THURSDAY|FRIDAY|SATURDAY|SUNDAY)$",
            flags = Pattern.Flag.CASE_INSENSITIVE,
            message = "Day of week must be a valid day (e.g. MONDAY, TUESDAY)"
    )
    private String dayOfWeek;

    @NotNull(message = "Slots list cannot be null")
    @Valid
    private List<TimeSlotDTO> slots;
}
