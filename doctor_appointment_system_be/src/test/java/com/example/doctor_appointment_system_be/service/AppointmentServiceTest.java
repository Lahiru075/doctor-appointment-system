package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.AppointmentRequestDTO;
import com.example.doctor_appointment_system_be.entity.Appointment;
import com.example.doctor_appointment_system_be.entity.Patient;
import com.example.doctor_appointment_system_be.entity.TimeSlot;
import com.example.doctor_appointment_system_be.entity.User;
import com.example.doctor_appointment_system_be.enums.AppointmentStatus;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.mapper.AppointmentMapper;
import com.example.doctor_appointment_system_be.repository.AppointmentRepository;
import com.example.doctor_appointment_system_be.repository.DoctorRepository;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.repository.TimeSlotRepository;
import com.example.doctor_appointment_system_be.service.impl.AppointmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AppointmentServiceTest {

    @Mock
    private AppointmentRepository appointmentRepository;
    @Mock
    private TimeSlotRepository timeSlotRepository;
    @Mock
    private DoctorRepository doctorRepository;
    @Mock
    private PatientRepository patientRepository;
    @Mock
    private AuditLogService auditLogService;
    @Mock
    private AppointmentMapper appointmentMapper;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    private Appointment mockAppointment;
    private TimeSlot mockTimeSlot;
    private Patient mockPatient;

    @BeforeEach
    void setUp() {
        User user = User.builder().id(1L).fullName("John Doe").email("john@test.com").build();
        mockPatient = Patient.builder().id(1L).user(user).build();

        mockTimeSlot = TimeSlot.builder()
                .id(10L)
                .date(LocalDate.now().plusDays(3))
                .startTime(LocalTime.of(10, 0))
                .isBooked(true)
                .build();

        mockAppointment = Appointment.builder()
                .id(100L)
                .status(AppointmentStatus.CONFIRMED)
                .patient(mockPatient)
                .timeSlot(mockTimeSlot)
                .build();
    }

    @Test
    @DisplayName("Should successfully cancel appointment when more than 24 hours in advance")
    void cancelAppointment_Success(){
        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));

        appointmentService.cancelAppointment(100L);

        assertEquals(AppointmentStatus.CANCELLED, mockAppointment.getStatus());
        assertFalse(mockTimeSlot.isBooked());
        assertNull(mockAppointment.getTimeSlot());
        verify(auditLogService, times(1)).logActivity(any());
    }

    @Test
    @DisplayName("Should throw APIException when cancelling less than 24 hours before appointment")
    void cancelAppointment_Fail_WhenLessThan24Hours(){
        mockTimeSlot.setDate(LocalDate.now());
        mockTimeSlot.setStartTime(LocalTime.now().plusHours(2));

        when(appointmentRepository.findById(100L)).thenReturn(Optional.of(mockAppointment));

        assertThrows(APIException.class, () -> appointmentService.cancelAppointment(100L));
    }

    @Test
    @DisplayName("Should throw Conflict when booking an already booked TimeSlot")
    void bookAppointment_ThrowsConflict_WhenSlotAlreadyBooked(){
        AppointmentRequestDTO dto = AppointmentRequestDTO.builder()
                .timeSlotId(10L)
                .doctorId(1L)
                .userId(1L)
                .build();

        mockTimeSlot.setBooked(true);
        when(timeSlotRepository.findById(10L)).thenReturn(Optional.of(mockTimeSlot));

        assertThrows(APIException.class, () -> appointmentService.bookAppointment(dto));
    }
}
