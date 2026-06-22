package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.PatientRequestDTO;
import com.example.doctor_appointment_system_be.dto.PatientResponseDTO;

import java.util.List;

public interface PatientService {
    List<PatientResponseDTO> getAllPatients();

    PatientResponseDTO updatePatient(Long id, PatientRequestDTO patientRequestDTO);

    void deletePatient(Long id);

    void togglePatientStatus(Long id);
}
