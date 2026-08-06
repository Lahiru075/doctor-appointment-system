package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.PrescriptionRequestDTO;
import com.example.doctor_appointment_system_be.dto.PrescriptionResponseDTO;

import java.util.List;

public interface PrescriptionService {
    void createPrescription(PrescriptionRequestDTO prescriptionRequestDTO);

    List<PrescriptionResponseDTO> getPatientPrescriptions(Long userId);
}
