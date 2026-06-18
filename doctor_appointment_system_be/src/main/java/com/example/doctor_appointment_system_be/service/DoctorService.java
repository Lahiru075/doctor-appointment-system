package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.DoctorRegisterDTO;
import com.example.doctor_appointment_system_be.dto.DoctorResponseDTO;

public interface DoctorService {
    DoctorResponseDTO registerDoctor(DoctorRegisterDTO doctorRegisterDTO);
}
