package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.PasswordChangeDTO;
import com.example.doctor_appointment_system_be.dto.PatientRequestDTO;
import com.example.doctor_appointment_system_be.dto.PatientResponseDTO;
import com.example.doctor_appointment_system_be.dto.PatientUpdateDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface PatientService {
    List<PatientResponseDTO> getAllPatients();

    PatientResponseDTO updatePatient(Long id, PatientRequestDTO patientRequestDTO);

    void deletePatient(Long id);

    void togglePatientStatus(Long id);

    void changePassword(Long userId, @Valid PasswordChangeDTO dto);

    void updatePatientProfile(Long userId, PatientUpdateDTO dto);

    PatientResponseDTO getPatientProfile(Long userId);
}
