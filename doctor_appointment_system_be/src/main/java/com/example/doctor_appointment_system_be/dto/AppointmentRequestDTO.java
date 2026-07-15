package com.example.doctor_appointment_system_be.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class AppointmentRequestDTO {
    private Long patientId;
    private Long doctorId;
    private Long timeSlotId;
}
