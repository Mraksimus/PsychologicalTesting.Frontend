
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // заменишь на свой бекенд

export const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    return res.data;
};

export const register = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/register`, { email, password });
    return res.data;
};
