import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Center, Loader } from "@mantine/core";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <Center style={{ height: "100vh" }}>
                <Loader size="lg" />
            </Center>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}