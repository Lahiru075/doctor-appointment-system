package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.AppointmentRequestDTO;
import com.example.doctor_appointment_system_be.dto.AppointmentResponseDTO;

import java.util.List;

public interface AppointmentService {
    AppointmentResponseDTO bookAppointment(AppointmentRequestDTO appointmentRequestDTO);

    List<AppointmentResponseDTO> getMyAppointments(Long userId);
}
