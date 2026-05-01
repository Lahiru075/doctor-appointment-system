package com.example.doctor_appointment_system_be.dto;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ApiResponse<T> {
    private boolean success;
    private int status;
    private String message;
    private T data;
    private LocalDateTime timestamp;
}
