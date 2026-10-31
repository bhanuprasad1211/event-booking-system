import axiosInstance
from "./axios";

export const loginUser =
async (data) => {

    const response =
        await axiosInstance.post(
            "users/login/",
            data
        );

    return response.data;
};

export const registerUser =
async (data) => {

    const response =
        await axiosInstance.post(
            "users/register/",
            data
        );

    return response.data;
};