import api from "./api"
import type  { WeeklyScheduleDTO, Specialization, DoctorSuggestion, DoctorResponseDTO } from "../types/types";



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

export const getSpecializations = async (): Promise<Specialization[]> => {
    const response = await api.get('/specializations');
    return response.data.data;
};

export const getDoctorSuggestions = async (query: string): Promise<DoctorSuggestion[]> => {
    const response = await api.get(`/doctors/suggestions`, {
        params: { query }
    });
    return response.data.data;
};

export const searchDoctors = async (name?: string, specializationId?: number | ''): Promise<DoctorResponseDTO[]> => {
    const params: any = {};
    if (name) params.name = name;
    if (specializationId) params.specializationId = specializationId;

    const response = await api.get(`/doctors/search`, { params });
    return response.data.data;
};