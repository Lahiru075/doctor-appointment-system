import api from "./api"
import type { AppointmentRequestDTO, AppointmentResponseDTO } from "../types/types";

export const bookAppointment = async (bookingRequest: AppointmentRequestDTO): Promise<AppointmentResponseDTO> => {
    try {
        const response = await api.post('/appointment/book', bookingRequest);
        return response.data.data;
    } catch (error: any) {
        console.error("Error booking appointment:", error.message);
        throw error;
    }
};