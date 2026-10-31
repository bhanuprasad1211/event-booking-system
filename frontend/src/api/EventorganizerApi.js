import axiosInstance
from "./axios";

export const createEvent =
async (formData) => {

    const response =
        await axiosInstance.post(
            "events/create/",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        );

    return response.data;
};

export const fetchOrganizerEvents =
async () => {

    const response =
        await axiosInstance.get(
            "events/my-events/"
        );

    return response.data;
};

export const deleteEvent =
async (slug) => {

    const response =
        await axiosInstance.delete(
            `events/delete/${slug}/`
        );

    return response.data;
};

export const publishEvent =
async (slug) => {

    const response =
        await axiosInstance.patch(
            `events/publish/${slug}/`
        );

    return response.data;
};

export const unpublishEvent =
async (slug) => {

    const response =
        await axiosInstance.patch(
            `events/unpublish/${slug}/`
        );

    return response.data;
};