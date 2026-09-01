package com.example.doctor_appointment_system_be.dto;

import com.example.doctor_appointment_system_be.enums.ActivityType;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLogRequestDTO {
    private Long userId;
    private String userEmail;
    private String actorName;
    private ActivityType activityType;
    private String action;
}
