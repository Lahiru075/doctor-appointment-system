
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

export interface DoctorResponseDTO {
    id: number;
    userId: number;
    fullName: string;
    email: string;
    experienceYears: number;
    specializationName: string; 
    consultationFee: number;
    biography: string;
}

export interface AvailableTimeSlotDTO {
    id: string;
    date: string; 
    startTime: string;
    endTime: string;
    isBooked: boolean;
}