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
}

export interface DailyScheduleDTO {
    dayOfWeek: DayOfWeek;
    available: boolean;
    slots: TimeSlotDTO[];
    slotDuration?: number; 
}

export interface WeeklyScheduleDTO {
    defaultSlotDuration: number;
    bufferBetweenSlots: number;
    days: DailyScheduleDTO[];
}