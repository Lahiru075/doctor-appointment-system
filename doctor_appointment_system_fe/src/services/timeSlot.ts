import api from "./api"
import type  { WeeklyScheduleDTO, AvailableTimeSlotDTO } from "../types/types";

export const saveAvailability = async (userId: number, schedule: WeeklyScheduleDTO) => {
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

export const getDoctorAvailableSlots = async (doctorId: number): Promise<AvailableTimeSlotDTO[]> => {
    try {

        const response = await api.get(`/time-slot/available/${doctorId}`);

        return response.data.data;

    } catch (error: any) {
        console.error("Error fetching available slots:", error.message);
        throw error; 
    }
}