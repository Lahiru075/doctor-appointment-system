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
import com.example.doctor_appointment_system_be.mapper.AppointmentMapper;
import com.example.doctor_appointment_system_be.repository.AppointmentRepository;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.repository.TimeSlotRepository;
import com.example.doctor_appointment_system_be.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    private final AppointmentMapper appointmentMapper;

    @Override
    @Transactional
    public AppointmentResponseDTO bookAppointment(AppointmentRequestDTO dto) {

        TimeSlot timeSlot = timeSlotRepository.findById(dto.getTimeSlotId())
                .orElseThrow(() -> new ResourceNotFoundException("Time Slot not found with ID: " + dto.getTimeSlotId()));

        if (timeSlot.isBooked()) {
            throw new APIException(HttpStatus.CONFLICT, "This time slot is already booked by another patient!");
        }

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));

        Patient patient = patientRepository.findByUserId(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found for User ID: " + dto.getUserId()));

        Appointment appointment = Appointment.builder()
                .status(AppointmentStatus.CONFIRMED)
                .patient(patient)
                .doctor(doctor)
                .timeSlot(timeSlot)
                .build();

        timeSlot.setBooked(true);

        Appointment savedAppointment = appointmentRepository.save(appointment);

        return appointmentMapper.toDTO(savedAppointment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponseDTO> getMyAppointments(Long userId) {

        return appointmentMapper.toDTOList(appointmentRepository.findAppointmentsByUserId(userId));

    }

    @Override
    @Transactional
    public void cancelAppointment(Long id) {

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + id));

        if (appointment.getStatus() == AppointmentStatus.CANCELLED){
            throw new APIException(HttpStatus.BAD_REQUEST, "This appointment is already cancelled.");
        }

        if (appointment.getStatus() == AppointmentStatus.COMPLETED){
            throw new APIException(HttpStatus.BAD_REQUEST, "Cannot cancel a completed appointment.");
        }

        TimeSlot timeSlot = appointment.getTimeSlot();

        if (timeSlot != null){

            LocalDateTime appointmentDateTime = LocalDateTime.of(timeSlot.getDate(), timeSlot.getStartTime());

            if (LocalDateTime.now().isAfter(appointmentDateTime.minusHours(24))){
                throw new APIException(HttpStatus.BAD_REQUEST, "Cannot cancel. Appointments must be cancelled at least 24 hours in advance.");
            }

            timeSlot.setBooked(false);

            appointment.setTimeSlot(null);
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
    }
}
