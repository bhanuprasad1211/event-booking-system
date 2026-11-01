import axios from "axios";

const axiosInstance = axios.create({
    // Use the Render URL if deployed, otherwise fallback to local testing URL
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/",
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "accessToken"
            );

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);

export default axiosInstance;