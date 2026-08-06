package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.PrescriptionRequestDTO;

public interface PrescriptionService {
    void createPrescription(PrescriptionRequestDTO prescriptionRequestDTO);
}
