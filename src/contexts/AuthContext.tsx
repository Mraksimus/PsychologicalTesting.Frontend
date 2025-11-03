import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser, isAuthenticated } from "@/api/auth";

interface User {
    id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, surname: string, patronymic: string | undefined, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
        try {
            await apiLogin(email, password);
            await checkAuth();
        } catch (error: any) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, surname: string, patronymic: string | undefined, email: string, password: string) => {
        setIsLoading(true);
        try {
            await apiRegister(name, surname, patronymic, email, password);
            await checkAuth();
        } catch (error: any) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        apiLogout();
        setUser(null);
    };

    const value = {
        user,
        isLoading,
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