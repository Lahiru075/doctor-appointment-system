package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.DoctorRegisterDTO;
import com.example.doctor_appointment_system_be.dto.DoctorResponse;

public interface DoctorService {
    DoctorResponse registerDoctor(DoctorRegisterDTO doctorRegisterDTO);
}
