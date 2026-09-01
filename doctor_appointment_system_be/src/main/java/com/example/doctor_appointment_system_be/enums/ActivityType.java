package com.example.doctor_appointment_system_be.enums;

public enum ActivityType {
    SECURITY,       // Login, Register, Status Toggle, Role Change, Password Reset
    BOOKING,        // Appointment Booked, Cancelled, Completed
    PRESCRIPTION,   // Prescription Issued / Updated
    REVIEW,         // Review Submitted / Deleted
    PROFILE         // Doctor / Patient Profile Info Updated
}