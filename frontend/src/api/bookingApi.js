import axiosInstance
from "./axios";

// FETCH USER BOOKINGS
export const fetchMyBookings =
async () => {

    const response =
        await axiosInstance.get(
            "bookings/my-bookings/"
        );

    return response.data;
};

// CANCEL BOOKING
export const cancelBooking =
async (bookingId) => {

    const response =
        await axiosInstance.post(
            `bookings/${bookingId}/cancel/`
        );

    return response.data;
};