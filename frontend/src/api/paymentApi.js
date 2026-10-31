import axiosInstance
from "./axios";

export const createPaymentOrder =
async (payload) => {

    const response =
        await axiosInstance.post(
            "payments/create-order/",
            payload
        );

    return response.data;
};

export const verifyPayment =
async (payload) => {

    const response =
        await axiosInstance.post(
            "payments/verify/",
            payload
        );

    return response.data;
};