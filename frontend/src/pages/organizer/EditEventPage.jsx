import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchSingleEvent, updateEvent } from "../../api/organizerApi";

const EditEventPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // 1. ADDED MISSING FIELDS to match Django's requirements
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date_time: "", // Changed from 'date' to 'date_time'
        location: "",
        price: "",
        category: "",  // Added
        capacity: ""   // Added
    });
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getEvent = async () => {
            try {
                const data = await fetchSingleEvent(id);
                
                // 2. FORMAT DATETIME for the HTML input
                // HTML <input type="datetime-local"> expects format "YYYY-MM-DDTHH:MM"
                // Django sends "YYYY-MM-DDTHH:MM:SSZ". We slice off the seconds and timezone.
                let formattedDateTime = "";
                if (data.date_time) {
                    formattedDateTime = data.date_time.substring(0, 16);
                }

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    date_time: formattedDateTime, // Use formatted datetime
                    location: data.location || "",
                    price: data.price || "",
                    category: data.category || "", // Populate category
                    capacity: data.capacity || ""  // Populate capacity
                });
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch event", err);
                setError("Failed to load event data.");
                setLoading(false);
            }
        };

        getEvent();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); 
        
        try {
            await updateEvent(id, formData);
            alert("Event updated successfully!");
            navigate("/organizer");
            
        } catch (err) {
            console.error("Full Error Object:", err);
            
            if (err.response && err.response.data) {
                const backendErrors = Object.entries(err.response.data)
                    .map(([field, msg]) => `${field.toUpperCase()}: ${msg}`)
                    .join(" | ");
                setError(`Backend Error: ${backendErrors}`);
            } else {
                setError("Failed to update event. Is the server running?");
            }
        }
    };

    if (loading) return <div className="p-6 text-center">Loading event data...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl mt-10">
            <h2 className="text-3xl font-bold mb-6">Edit Event</h2>
            
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
                    {error}
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title and Category Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Event Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Category</label>
                        {/* Note: If category is a foreign key in Django, this might need to be a <select> dropdown of category IDs */}
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        rows="4"
                        required
                    />
                </div>

                {/* Date/Time, Price, Capacity Row */}
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Date & Time</label>
                        <input
                            type="datetime-local" // Changed to datetime-local
                            name="date_time" // Match backend field name
                            value={formData.date_time}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Price ($)</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-2">Capacity</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-2 rounded-lg"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded-lg"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditEventPage;