export type DayOfWeek = 
    | 'MONDAY' 
    | 'TUESDAY' 
    | 'WEDNESDAY' 
    | 'THURSDAY' 
    | 'FRIDAY' 
    | 'SATURDAY' 
    | 'SUNDAY';

interface TimeSlotDTO {
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