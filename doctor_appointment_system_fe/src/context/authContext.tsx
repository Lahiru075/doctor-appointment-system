import { createContext, useContext, useEffect, useState } from "react"
import { getMyDetails } from "../services/user";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token  = localStorage.getItem('accessToken');

        if (token) {
            getMyDetails()
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    setUser(null);
                    console.log(err)
                    // localStorage.removeItem('accessToken');
                    // localStorage.removeItem('refreshToken');    
                }).finally(() => {
                    setLoading(false);
                })
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context  = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within a AuthProvider');
    }
    return context
}

