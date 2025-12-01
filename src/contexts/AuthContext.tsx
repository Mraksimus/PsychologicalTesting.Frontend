import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, isAuthenticated } from "@/api/auth";

interface User {
    id: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, surname: string, patronymic: string | undefined, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const checkAuth = useCallback(async () => {
        try {
            if (isAuthenticated()) {
                const currentUser = getCurrentUser();
                // Если id null, пользователь не аутентифицирован
                if (currentUser.id) {
                    setUser({ id: currentUser.id });
                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);  // ✅ ОЧИСТКА ОШИБОК
        try {
            await apiLogin(email, password);
            await checkAuth();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка при входе';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, surname: string, patronymic: string | undefined, email: string, password: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await apiRegister(name, surname, patronymic, email, password);
            await checkAuth();
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Ошибка при регистрации';
            setError(errorMessage);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        apiLogout();
        setUser(null);
        setError(null);
    };

    const value = {
        user,
        isLoading,
        loading: isLoading,
        error,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;