import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
    fetchOrganizerEvents, 
    deleteEvent, 
    publishEvent, 
    unpublishEvent 
} from "../../api/organizerApi";

const OrganizerDashboard = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchOrganizerEvents();
                const eventsArray = Array.isArray(data) ? data : (data?.results || []);
                setEvents(eventsArray);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load events", err);
                setError("Failed to load your events. Please try again.");
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            try {
                await deleteEvent(id);
                setEvents(events.filter((event) => event.id !== id));
            } catch (err) {
                console.error("Failed to delete event", err);
                alert("Failed to delete the event. Please try again.");
            }
        }
    };

    const handleTogglePublish = async (event) => {
        try {
            if (event.is_published) {
                await unpublishEvent(event.id);
            } else {
                await publishEvent(event.id);
            }
            
            setEvents(events.map((e) => 
                e.id === event.id ? { ...e, is_published: !event.is_published } : e
            ));
        } catch (err) {
            console.error("Failed to change publish status", err);
            alert("Failed to update event status.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    if (events.length === 0 && !error) {
        return (
            <div className="max-w-6xl mx-auto p-6 text-center">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">
                    Organizer Dashboard
                </h1>
                <div className="bg-gray-50 rounded-lg p-12">
                    <p className="text-gray-500 text-lg mb-6">
                        You haven't created any events yet.
                    </p>
                    <Link
                        to="/organizer/create"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-md"
                    >
                        + Create Your First Event
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-gray-900">
                        Organizer Dashboard
                    </h1>
                    <p className="text-gray-600">
                        You are managing {events.length} event{events.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Link
                    to="/organizer/create"
                    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                    + Create New Event
                </Link>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                    {error}
                </div>
            )}

            {/* Events Grid */}
            <div className="grid md:grid-cols-2 gap-8">
                {events.map((event) => (
                    <div
                        key={event.id}
                        className="rounded-2xl shadow-lg bg-white overflow-hidden transition-transform hover:scale-[1.02] duration-300 flex flex-col justify-between"
                        style={{ backgroundColor: "#ffffff", color: "#000000" }}
                    >
                        {/* Header Section */}
                        <div>
                            <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">
                                        {event.title}
                                    </h2>
                                    <p className="text-blue-100 text-sm">
                                        Event ID: #{event.id}
                                    </p>
                                </div>
                                <span
                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                        event.is_published
                                            ? "bg-green-100 text-green-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                >
                                    <span
                                        className={`w-2 h-2 rounded-full mr-2 ${
                                            event.is_published ? "bg-green-500" : "bg-gray-400"
                                        }`}
                                    />
                                    {event.is_published ? "Published" : "Draft"}
                                </span>
                            </div>

                            {/* Details Content */}
                            <div className="p-6">
                                <div className="space-y-3 text-sm text-gray-600 mb-6">
                                    <div className="flex justify-between">
                                        <span className="font-medium">Date & Time:</span>
                                        <span>
                                            {event.date_time
                                                ? new Date(event.date_time).toLocaleString([], {
                                                      dateStyle: "medium",
                                                      timeStyle: "short",
                                                  })
                                                : "Not scheduled"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Capacity / Remaining:</span>
                                        <span>
                                            {event.available_tickets ?? 0} / {event.capacity ?? 0} left
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">Ticket Price:</span>
                                        <span>
                                            ₹{Number(event.price || 0).toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                </div>

                                {/* Navigation Actions (2x2 Grid) */}
                                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                                    <Link
                                        to={`/organizer/edit/${event.id}`}
                                        className="py-2.5 text-center font-medium bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        to={`/organizer/analytics/${event.id}`}
                                        className="py-2.5 text-center font-medium bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition text-sm"
                                    >
                                        Analytics
                                    </Link>
                                    <Link
                                        to={`/organizer/attendees/${event.id}`}
                                        className="py-2.5 text-center font-medium bg-gray-50 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-100 transition text-sm"
                                    >
                                        Attendees
                                    </Link>
                                    <Link
                                        to={`/organizer/check-in/${event.id}`}
                                        className="py-2.5 text-center font-medium bg-blue-50 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-100 transition text-sm font-semibold"
                                    >
                                        Scan QR
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Card Controls Footer */}
                        <div className="px-6 pb-6 pt-2 flex gap-3">
                            <button
                                onClick={() => handleTogglePublish(event)}
                                className={`flex-1 py-2.5 rounded-xl font-medium text-sm transition border ${
                                    event.is_published
                                        ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                        : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                }`}
                            >
                                {event.is_published ? "Unpublish Event" : "Publish Event"}
                            </button>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="px-5 py-2.5 rounded-xl font-medium text-sm bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrganizerDashboard;