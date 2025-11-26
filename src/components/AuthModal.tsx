import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, isAuthenticated } from "@/api/auth";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, surname: string, patronymic?: string, email?: string, password?: string) => Promise<void>;
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
                const currentUser = await getCurrentUser();
                setUser(currentUser);
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
        setError(null);
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

    // ✅ ОБНОВЛЕНО: register принимает оба варианта
    const register = async (
        nameOrEmail: string,
        surnameOrPassword: string,
        patronymic?: string,
        email?: string,
        password?: string
    ) => {
        setIsLoading(true);
        setError(null);
        try {
            // Если передано только 2 параметра (email, password)
            if (!email && !password) {
                await apiRegister('User', '', undefined, nameOrEmail, surnameOrPassword);
            } else {
                // Если передано 5 параметров (name, surname, patronymic, email, password)
                await apiRegister(nameOrEmail, surnameOrPassword, patronymic, email!, password!);
            }
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