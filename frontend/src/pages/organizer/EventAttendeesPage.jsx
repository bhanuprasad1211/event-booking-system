import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchAttendees } from "../../api/organizerApi";

const EventAttendeesPage = () => {
    const { id } = useParams();
    const [attendees, setAttendees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getAttendees = async () => {
            try {
                const data = await fetchAttendees(id);
                console.log("Attendees Data:", data);
                
                // Safely extract array in case Django uses pagination { count: X, results: [...] }
                const attendeesArray = Array.isArray(data) ? data : (data?.results || []);
                setAttendees(attendeesArray);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load attendees", err);
                setError("Failed to load attendee list.");
                setLoading(false);
            }
        };

        getAttendees();
    }, [id]);

    if (loading) return <div className="p-6 text-center">Loading attendees...</div>;
    if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 mt-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Event Attendees</h1>
                <Link to="/organizer" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {attendees.length > 0 ? (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600">Name</th>
                                <th className="p-4 font-semibold text-gray-600">Email</th>
                                <th className="p-4 font-semibold text-gray-600">Ticket Type</th>
                                <th className="p-4 font-semibold text-gray-600">Booking Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendees.map((attendee, index) => (
                                <tr key={attendee.id || index} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="p-4">{attendee.name || "N/A"}</td>
                                    
                                    <td className="p-4">{attendee.email || "N/A"}</td>
                                    
                                    <td className="p-4">
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                            {attendee.ticket_count} {attendee.ticket_count === 1 ? 'Ticket' : 'Tickets'}
                                        </span>
                                    </td>
                                    
                                    <td className="p-4">
                                        {/* Updated to look for booked_at instead of created_at */}
                                        {attendee.booked_at 
                                            ? new Date(attendee.booked_at).toLocaleDateString() 
                                            : "N/A"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        No attendees have booked tickets for this event yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventAttendeesPage;