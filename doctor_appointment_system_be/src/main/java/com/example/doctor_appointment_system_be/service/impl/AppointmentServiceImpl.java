package com.example.doctor_appointment_system_be.service.impl;

import com.example.doctor_appointment_system_be.dto.AppointmentRequestDTO;
import com.example.doctor_appointment_system_be.dto.AppointmentResponseDTO;
import com.example.doctor_appointment_system_be.dto.DoctorResponseDTO;
import com.example.doctor_appointment_system_be.entity.Appointment;
import com.example.doctor_appointment_system_be.entity.Doctor;
import com.example.doctor_appointment_system_be.entity.Patient;
import com.example.doctor_appointment_system_be.entity.TimeSlot;
import com.example.doctor_appointment_system_be.enums.AppointmentStatus;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.exception.ResourceNotFoundException;
import com.example.doctor_appointment_system_be.repository.AppointmentRepository;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.repository.TimeSlotRepository;
import com.example.doctor_appointment_system_be.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Override
    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {

        TimeSlot timeSlot = timeSlotRepository.findById(dto.getTimeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Time Slot not found with ID: " + dto.getTimeSlotId()));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));


        Patient patient = patientRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found for User ID: " + dto.getUserId()));

        if (timeSlot.isBooked()) {
            throw new APIException(HttpStatus.CONFLICT, "This time slot is already booked by another patient!");
        }

        Appointment appointment = Appointment.builder()
                .status(AppointmentStatus.PENDING)
                .patient(patient)
                .doctor(doctor)
                .timeSlot(timeSlot)
                .build();

        timeSlot.setBooked(true);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return AppointmentResponseDTO.builder()
                .id(savedAppointment.getId())
                .doctorName(doctor.getUser().getFullName())
                .specializationName(doctor.getSpecialization().getName())
                .date(timeSlot.getDate().toString())
                .time(timeSlot.getStartTime().toString() + " - " + timeSlot.getEndTime().toString())
                .consultationFee(doctor.getConsultationFee())
                .status(savedAppointment.getStatus().name())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getMyAppointments(Long userId) {

        return appointmentRepository.findAppointmentsByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

    }

    private AppointmentResponseDTO mapToResponse(Appointment appointment) {
        return AppointmentResponseDTO.builder()
                .id(appointment.getId())
                .doctorName(appointment.getDoctor().getUser().getFullName())
                .specializationName(appointment.getDoctor().getSpecialization().getName())
                .date(appointment.getTimeSlot().getDate().toString())
                .time(appointment.getTimeSlot().getStartTime().toString() + " - " + appointment.getTimeSlot().getEndTime().toString())
                .consultationFee(appointment.getDoctor().getConsultationFee())
                .status(appointment.getStatus().name())
                .build();
    }

}
