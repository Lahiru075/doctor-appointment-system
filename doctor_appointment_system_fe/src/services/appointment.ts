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

export const getPatientAppointments = async (userId: number): Promise<AppointmentResponseDTO[]> => {
    try {
        const response = await api.get(`/appointment/patients/${userId}`);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching patient appointments:", error.message);
        throw error;
    }
};

export const cancelAppointment = async (appointmentId: number): Promise<void> => {

    try {
        await api.put(`/appointment/cancel/${appointmentId}`);
    } catch (error: any) {
        console.error("Error cancelling appointment:", error.message);
        throw error;
    }
};


export const completeAppointment = async (appointmentId: number): Promise<void> => {
    try {
        await api.put(`/appointment/complete/${appointmentId}`);
    } catch (error: any) {
        console.error("Error completing appointment:", error.message);
        throw error;
    }
};

export const getDoctorAppointments = async (doctorId: number): Promise<AppointmentResponseDTO[]> => {
    try {
        const response = await api.get(`/appointment/doctors/${doctorId}`);
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching doctor appointments:", error.message);
        throw error;
    }
};