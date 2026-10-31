import axiosInstance
from "./axios";

// FETCH ALL EVENTS
export const fetchEvents =
async () => {

    const response =
        await axiosInstance.get(
            "events/"
        );

    return response.data;
};

// FETCH SINGLE EVENT
export const fetchEventDetails =
async (id) => {

    const response =
        await axiosInstance.get(
            `events/${id}/`
        );

    return response.data;
};