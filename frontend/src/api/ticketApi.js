import axiosInstance
from "./axios";

export const fetchMyTickets =
async () => {

    const response =
        await axiosInstance.get(
            "bookings/my-tickets/"
        );

    return response.data;
};