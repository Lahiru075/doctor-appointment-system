import api from "./api"
import type  { Specialization, DoctorSuggestion, DoctorResponseDTO } from "../types/types";


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