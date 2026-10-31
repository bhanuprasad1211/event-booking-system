import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchEventAnalytics } from "../../api/organizerApi";

const EventAnalyticsPage = () => {
    const { id } = useParams();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getAnalytics = async () => {
            try {
                const data = await fetchEventAnalytics(id);
                console.log("Analytics Data from Django:", data);
                setAnalytics(data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load analytics", err);
                // Better error logging for debugging
                if (err.response?.status === 404) {
                    setError("Event not found or you don't have permission to view it.");
                } else {
                    setError("Failed to load analytics data.");
                }
                setLoading(false);
            }
        };

        getAnalytics();
    }, [id]);

    if (loading) return <div className="p-6 text-center">Loading analytics...</div>;
    if (error) return <div className="p-6 text-red-500 text-center">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6 mt-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold">Analytics</h1>
                    <p className="text-gray-500 mt-2 text-lg">{analytics?.event}</p>
                </div>
                <Link to="/organizer" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Total Revenue (Matches backend "revenue") */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-green-600">
                        ${analytics?.revenue || 0}
                    </p>
                </div>

                {/* Tickets Sold (Matches backend "total_tickets") */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Tickets Sold</h3>
                    <p className="text-3xl font-bold text-blue-600">
                        {analytics?.total_tickets || 0}
                    </p>
                </div>

                {/* Total Bookings (Matches backend "total_bookings") */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 font-medium mb-2">Total Orders</h3>
                    <p className="text-3xl font-bold text-purple-600">
                        {analytics?.total_bookings || 0}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EventAnalyticsPage;