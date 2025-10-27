import React from "react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import {Welcome} from "./components/Welcome/Welcome";
import { HomePage } from "@/pages/HomePage";

export default function App() {
    return (
        <MantineProvider theme={{}}>
            <Notifications position="top-right" />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<HomePage />} />
                    <Route path="/welcome" element={<Welcome />} />
                </Routes>
            </BrowserRouter>
        </MantineProvider>
    );
}