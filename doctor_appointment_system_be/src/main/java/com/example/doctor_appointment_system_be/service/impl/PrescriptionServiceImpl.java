package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.PrescriptionRequestDTO;
import com.example.doctor_appointment_system_be.entity.Appointment;
import com.example.doctor_appointment_system_be.entity.Prescription;
import com.example.doctor_appointment_system_be.enums.AppointmentStatus;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.AppointmentRepository;
import com.example.doctor_appointment_system_be.repository.PrescriptionRepository;
import com.example.doctor_appointment_system_be.service.PrescriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional
    public void createPrescription(PrescriptionRequestDTO dto) {

        Appointment appointment = appointmentRepository.findByIdWithPatientAndDoctor(dto.getAppointmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));

        if (prescriptionRepository.existsByAppointmentId(appointment.getId())){
            throw new APIException(HttpStatus.CONFLICT, "Prescription already exists for this appointment");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED || appointment.getStatus() == AppointmentStatus.COMPLETED){
            throw new APIException(HttpStatus.CONFLICT, "Appointment is not in a valid state for prescription");
        }
        
        appointment.setStatus(AppointmentStatus.COMPLETED);

        Prescription prescription = Prescription.builder()
                .diagnosis(dto.getDiagnosis())
                .medications(dto.getMedications())
                .appointment(appointment)
                .doctor(appointment.getDoctor()) 
                .patient(appointment.getPatient()) 
                .build();
        
        prescriptionRepository.save(prescription);
    }
}
