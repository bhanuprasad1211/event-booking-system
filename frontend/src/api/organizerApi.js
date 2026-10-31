import axiosInstance
from "./axios";

/*
====================================
CREATE EVENT
====================================
*/

export const createEvent =
async (formData) => {

    const response =
        await axiosInstance.post(

            "events/create/",

            formData
        );

    return response.data;
};

/*
====================================
MY ORGANIZER EVENTS
====================================
*/

export const fetchOrganizerEvents =
async () => {

    const response =
        await axiosInstance.get(

            "events/my-events/"
        );

    return response.data;
};

/*
====================================
PUBLISH EVENT
====================================
*/

export const publishEvent =
async (eventId) => {

    const response =
        await axiosInstance.patch(

            `events/publish/${eventId}/`
        );

    return response.data;
};

/*
====================================
UNPUBLISH EVENT
====================================
*/

export const unpublishEvent =
async (eventId) => {

    const response =
        await axiosInstance.patch(

            `events/unpublish/${eventId}/`
        );

    return response.data;
};

/*
====================================
DELETE EVENT
====================================
*/

export const deleteEvent =
async (eventId) => {

    const response =
        await axiosInstance.delete(

            `events/delete/${eventId}/`
        );

    return response.data;
};

/*
====================================
EVENT ANALYTICS
====================================
*/

export const fetchEventAnalytics =
async (eventId) => {

    const response =
        await axiosInstance.get(

            `events/analytics/${eventId}/`
        );

    return response.data;
};

/*
====================================
EVENT ATTENDEES
====================================
*/

export const fetchAttendees =
async (eventId) => {

    const response =
        await axiosInstance.get(

            `events/attendees/${eventId}/`
        );

    return response.data;
};

/*
====================================
FETCH SINGLE EVENT
====================================
*/

export const fetchSingleEvent =
async (id) => {

    const response =
        await axiosInstance.get(
            `events/${id}/`
        );

    return response.data;
};

/*
====================================
UPDATE EVENT
====================================
*/

export const updateEvent =
async (id, formData) => {

    const response =
        await axiosInstance.put(
            `events/edit/${id}/`,
            formData
        );

    return response.data;
};

/*
====================================
TICKET CHECK-IN
====================================
*/
export const checkInTicket = async (eventId, qrData) => {
    const response = await axiosInstance.post(
        `events/${eventId}/check-in/`, 
        { qr_data: qrData }
    );
    return response.data;
};

/*
====================================
TICKET VERIFICATION & CHECK-IN
====================================
*/

export const verifySignedQR = async (qrData) => {
    // Points to your VerifySignedQRCodeView
    const response = await axiosInstance.post("checkin/verify-signed/", {
        qr_data: qrData
    });
    return response.data;
};

export const confirmTicketCheckIn = async (ticketUuid) => {
    // Points to your CheckInTicketView
    const response = await axiosInstance.post(`checkin/checkin/${ticketUuid}/`);
    return response.data;
};