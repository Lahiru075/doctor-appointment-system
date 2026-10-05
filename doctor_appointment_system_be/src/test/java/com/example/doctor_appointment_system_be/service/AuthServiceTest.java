package com.example.doctor_appointment_system_be.service;

import com.example.doctor_appointment_system_be.dto.LoginDTO;
import com.example.doctor_appointment_system_be.dto.LoginResponse;
import com.example.doctor_appointment_system_be.dto.RegisterDTO;
import com.example.doctor_appointment_system_be.dto.RegisterResponse;
import com.example.doctor_appointment_system_be.entity.Patient;
import com.example.doctor_appointment_system_be.entity.User;
import com.example.doctor_appointment_system_be.enums.Role;
import com.example.doctor_appointment_system_be.exception.APIException;
import com.example.doctor_appointment_system_be.repository.PatientRepository;
import com.example.doctor_appointment_system_be.repository.UserRepository;
import com.example.doctor_appointment_system_be.service.impl.AuthServiceImpl;
import com.example.doctor_appointment_system_be.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PatientRepository patientRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtUtil jwtUtil;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterDTO registerDTO;
    private LoginDTO loginDTO;
    private User mockUser;

    @BeforeEach
    void setUp() {
        registerDTO = RegisterDTO.builder()
                .fullName("Kamal Perera")
                .email("kamal@test.com")
                .password("Password@123")
                .phoneNumber("0771234567")
                .bloodGroup("O+")
                .medicalHistory("None")
                .build();

        loginDTO = LoginDTO.builder()
                .email("kamal@test.com")
                .password("Password@123")
                .build();

        mockUser = User.builder()
                .id(1L)
                .fullName("Kamal Perera")
                .email("kamal@test.com")
                .password("encoded_pass")
                .role(Role.PATIENT)
                .isActive(true)
                .build();
    }

    @Test
    @DisplayName("Should successfully register new patient")
    void register_Success() {
        when(userRepository.existsByEmail("kamal@test.com")).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(patientRepository.save(any(Patient.class))).thenReturn(new Patient());

        RegisterResponse response = authService.register(registerDTO);

        assertNotNull(response);
        assertEquals("kamal@test.com", response.getEmail());
        assertEquals("PATIENT", response.getRole());
        verify(userRepository, times(1)).save(any(User.class));
        verify(patientRepository, times(1)).save(any(Patient.class));
        verify(auditLogService, times(1)).logActivity(any());
    }

    @Test
    @DisplayName("Should throw Conflict exception when email already exists")
    void register_ThrowsConflict_WhenEmailExists() {
        when(userRepository.existsByEmail("kamal@test.com")).thenReturn(true);

        assertThrows(APIException.class, () -> authService.register(registerDTO));

        // Ensure user is never saved if email exists
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully login and return JWT tokens")
    void login_Success() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByEmail("kamal@test.com")).thenReturn(Optional.of(mockUser));
        when(jwtUtil.generateAccessToken(any(User.class))).thenReturn("mock_access_token");
        when(jwtUtil.generateRefreshToken(any(User.class))).thenReturn("mock_refresh_token");

        LoginResponse response = authService.login(loginDTO);

        assertNotNull(response);
        assertEquals("mock_access_token", response.getAccessToken());
        assertEquals("mock_refresh_token", response.getRefreshToken());
        verify(auditLogService, times(1)).logActivity(any());
    }

    @Test
    @DisplayName("Should throw BadCredentialsException when password is wrong")
    void login_ThrowsException_WhenCredentialsInvalid() {
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid password"));

        assertThrows(APIException.class, () -> authService.login(loginDTO));
    }
}
