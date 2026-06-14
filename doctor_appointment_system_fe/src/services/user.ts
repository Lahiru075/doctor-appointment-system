import api from "./api"

type RegisterDataType = {
    fullName: string,
    email: string,
    password: string
    phoneNumber?: string
    bloodGroup?: string
    medicalHistory?: string
}

type LoginDataType = {
    email: string,
    password: string
}

export const register = async (data: RegisterDataType) => {
    const res = await api.post("/users/register", data)
    return res.data
}

export const signin = async (data: LoginDataType) => {
    const res = await api.post("/users/login", data)
    return res.data
}

export const getMyDetails = async () => {
    const res = await api.get('/users/me')
    return res.data
}

export const refreshTokens = async (refreshToken: string) => {
    const res = await api.post('/users/refresh', { token: refreshToken })
    return res.data
}