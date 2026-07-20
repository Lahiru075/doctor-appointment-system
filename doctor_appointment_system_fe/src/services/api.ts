import axios, { AxiosError } from "axios";
import { refreshTokens } from "./user";

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
});

const PUBLIC_ENDPOINTS = ["/users/login", "/users/register"];

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    const isPublicEndpoint = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));

    if (token && !isPublicEndpoint) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        const isPublicEndpoint = PUBLIC_ENDPOINTS.some((url) => originalRequest.url?.includes(url));

        if (error.response?.status === 401 && !isPublicEndpoint && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");

                if (!refreshToken) {
                    throw new Error("Refresh token not found");
                }

                const res = await refreshTokens(refreshToken);

                localStorage.setItem("accessToken", res.accessToken);

                originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
                return axios(originalRequest);

            } catch (error: any) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";

                console.log("Erro ekak enwa: ", error.message);

                console.error('Token refresh failed:', error);
                return Promise.reject(error);

            }
        }

        return Promise.reject(error);
    }
)

export default api