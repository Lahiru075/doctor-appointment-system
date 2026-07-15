package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.AppointmentRequestDTO;
import com.example.doctor_appointment_system_be.dto.AppointmentResponseDTO;

public interface AppointmentService {
    AppointmentResponseDTO bookAppointment(AppointmentRequestDTO appointmentRequestDTO);
}
