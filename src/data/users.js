import { BASE_URL } from "./EventsApiURL";
import axios from "axios";
const getUserFromApi = async (formData) => {
    if (!formData) return;
    const dataForTestingApp = {
        token: "A testing token",
        user: {
            id: 1,
            email: formData.email,
        },
    };
    return dataForTestingApp;
    const res = await axios.post(`${BASE_URL}/auth/login`, formData, {
        headers: {
            "Content-Type": "application/json",
        },
    });
    console.log("Response", res.data);
    return res.data;
};

const profile = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token is not found!");

    try {
        const res = await axios.get(`${BASE_URL}/auth/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Something went wrong!";

        // Show specific error to the user
        alert(errorMessage);
        throw new Error(`${error.response?.status || 500}`);
    }
};

const logout = () => {
    localStorage.removeItem("token");
};

export { getUserFromApi, profile, logout };
