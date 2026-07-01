import api from "./api"
import type  { WeeklyScheduleDTO } from "../types/types";

export interface DoctorProfile {
    id: number;
    fullName: string;
    email: string;
    specialization: string;
    consultationFee: number;
    experienceYears: number;
    biography: string;
}


export const saveAvailability = async (userId: number, schedule: WeeklyScheduleDTO) => {
    console.log(schedule)
    try {
        await api.post(`/time-slot/generate/${userId}`, schedule);
    } catch (error: any) {
        console.error("Error saving availability:", error.message);
        throw error; 
    }
};

export const getAvailability = async (userId: number): Promise<WeeklyScheduleDTO> => {
    const response = await api.get(`/time-slot/${userId}`);
    return response.data.data; 
};