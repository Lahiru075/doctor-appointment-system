import api from "./api"
import type { Specialization } from "../types/types";

export const getSpecializations = async (): Promise<Specialization[]> => {
    const response = await api.get('/specializations');
    return response.data.data;
};