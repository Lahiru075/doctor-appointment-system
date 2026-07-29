
// doctors

export type DayOfWeek = 
    | 'MONDAY' 
    | 'TUESDAY' 
    | 'WEDNESDAY' 
    | 'THURSDAY' 
    | 'FRIDAY' 
    | 'SATURDAY' 
    | 'SUNDAY';

export interface TimeSlotDTO {
    id?: string;
    startTime: string; 
    endTime: string;   
    booked: boolean;
}

export interface DailyScheduleDTO {
    dayOfWeek: DayOfWeek;
    slots: TimeSlotDTO[];
    slotDuration?: number; 
}

export interface WeeklyScheduleDTO {
    defaultSlotDuration: number;
    days: DailyScheduleDTO[];
}

export interface DoctorSuggestion {
    id: number;
    fullName: string;
}

export interface Specialization {
    id: number;
    name: string;
    description: string;
}

export interface DoctorRegisterDTO {
    fullName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    experienceYears: number;
    specializationId: number;
    biography?: string;
    consultationFee: number;
}

export interface DoctorUpdateDTO {
    specializationId: number;
    biography?: string;
    consultationFee: number;
    experienceYears: number;
}

export interface DoctorResponseDTO {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    active: boolean;
    experienceYears: number;
    specializationName: string; 
    consultationFee: number;
    biography: string;
    averageRating: number;
}

export interface AvailableTimeSlotDTO {
    id: string;
    date: string; 
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export interface DoctorProfileUpdateDTO {
    biography: string;
    consultationFee: number;
    experienceYears: number;
}

// appointments

export interface AppointmentRequestDTO {
    userId: number;
    doctorId: number;
    timeSlotId: string | number;
}

export interface AppointmentResponseDTO {
    id: number;
    doctorName: string;
    specializationName: string;
    date: string;
    time: string;
    consultationFee: number;
    status: string;
    patientName?: string;
}

// reviews

export interface ReviewRequestDTO {
    appointmentId: number;
    rating: number; // 1-5 stars [1]
    comment: string;
}

export interface ReviewResponseDTO {
    id: number;
    rating: number;
    comment: string;
    patientName: string;
    createdAt: string;
}

// patient

export interface PatientResponseDTO {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string | null;
    bloodGroup: string | null;
    medicalHistory: string | null;
    isActive: boolean; 
}

export interface PatientUpdateDTO {
    bloodGroup: string;
    medicalHistory: string;
}

// specialization

export interface SpecializationDTO {
    name: string;
    description: string;
}

export interface SpecializationResponseDTO {
    id: number;
    name: string;
    description: string;
}

// admin dashboard

export interface ChartDataDTO {
    date: string;
    count: number;
}

export interface AdminDashboardDTO {
    totalDoctors: number;
    totalPatients: number;
    totalSpecializations: number;
    totalAppointments: number;
    appointmentTrends: ChartDataDTO[];
}

// change password

export interface PasswordChangeDTO {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}