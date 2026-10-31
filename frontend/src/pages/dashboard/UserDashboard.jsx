import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { fetchMyBookings } from "../../api/bookingApi";

const UserDashboard = () => {
    const role = localStorage.getItem("role");

    // If an organizer visits /dashboard, send them to /organizer
    if (role === "ORGANIZER") {
        return <Navigate to="/organizer" replace />;
    }

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const username = localStorage.getItem("username") || "User";

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const data = await fetchMyBookings();
                setBookings(data.results || data || []);
            } catch (error) {
                console.error("Failed to load dashboard bookings:", error);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    // Derived metrics
    const confirmedBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === "confirmed" || b.status?.toLowerCase() === "booked"
    );
    const pendingBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === "pending"
    );
    const totalSpent = confirmedBookings.reduce(
        (sum, b) => sum + Number(b.total_price || 0),
        0
    );

    const recentBookings = bookings.slice(0, 4);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-gray-900">
                        Welcome back, {username}!
                    </h1>
                    <p className="text-gray-600">
                        Here is an overview of your bookings, activity, and tickets.
                    </p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link
                        to="/events"
                        className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg text-sm"
                    >
                        Explore Events
                    </Link>
                    <Link
                        to="/my-tickets"
                        className="inline-flex items-center justify-center bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-sm text-sm"
                    >
                        My Tickets
                    </Link>
                </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Active Bookings
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {confirmedBookings.length}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-bold">
                        🎟️
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Pending Payments
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            {pendingBookings.length}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-2xl font-bold">
                        ⏳
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Total Spent
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                            ₹{totalSpent.toLocaleString("en-IN")}
                        </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl font-bold">
                        💳
                    </div>
                </div>
            </div>

            {/* Main Content: Recent Bookings & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings Cards (2 Columns) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Recent Bookings
                        </h2>
                        <Link
                            to="/my-bookings"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            View All Bookings →
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                            <p className="text-gray-500 text-lg mb-4">
                                You haven't booked any events yet.
                            </p>
                            <Link
                                to="/events"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl transition-colors duration-200 shadow-md text-sm"
                            >
                                Browse Upcoming Events
                            </Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {recentBookings.map((b) => (
                                <div
                                    key={b.id}
                                    className="rounded-2xl shadow-lg bg-white overflow-hidden transition-transform hover:scale-[1.02] duration-300 flex flex-col justify-between"
                                >
                                    {/* Card Header matching ticket theme */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-start">
                                        <div className="min-w-0 pr-2">
                                            <h3 className="text-xl font-bold text-white truncate">
                                                {b.event_title}
                                            </h3>
                                            <p className="text-blue-100 text-xs mt-0.5">
                                                Booking ID: #{b.id}
                                            </p>
                                        </div>
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                                                b.status?.toLowerCase() === "confirmed" || b.status?.toLowerCase() === "booked"
                                                    ? "bg-green-100 text-green-800"
                                                    : b.status?.toLowerCase() === "pending"
                                                    ? "bg-amber-100 text-amber-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            <span
                                                className={`w-2 h-2 rounded-full mr-2 ${
                                                    b.status?.toLowerCase() === "confirmed" || b.status?.toLowerCase() === "booked"
                                                        ? "bg-green-500"
                                                        : b.status?.toLowerCase() === "pending"
                                                        ? "bg-amber-500"
                                                        : "bg-gray-400"
                                                }`}
                                            />
                                            {b.status}
                                        </span>
                                    </div>

                                    {/* Card Details */}
                                    <div className="p-6">
                                        <div className="space-y-2.5 text-sm text-gray-600 mb-6">
                                            <div className="flex justify-between">
                                                <span className="font-medium">Tickets:</span>
                                                <span className="text-gray-900 font-semibold">
                                                    {b.ticket_count} {b.ticket_count === 1 ? "ticket" : "tickets"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-medium">Total Price:</span>
                                                <span className="text-gray-900 font-semibold">
                                                    ₹{Number(b.total_price || 0).toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        </div>

                                        <Link
                                            to="/my-tickets"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 text-sm shadow-sm"
                                        >
                                            View Tickets
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Shortcuts (1 Column) */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Quick Shortcuts
                    </h2>

                    <div className="space-y-4">
                        <Link
                            to="/events"
                            className="block rounded-2xl shadow-md bg-white p-6 border border-gray-100 hover:shadow-lg transition-shadow group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                                    🎉
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        Explore Events
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Discover upcoming concerts, sports, and workshops
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/my-tickets"
                            className="block rounded-2xl shadow-md bg-white p-6 border border-gray-100 hover:shadow-lg transition-shadow group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                                    📱
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        Digital QR Tickets
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Show QR passes at entrance or download PDFs
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/my-bookings"
                            className="block rounded-2xl shadow-md bg-white p-6 border border-gray-100 hover:shadow-lg transition-shadow group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                                    📄
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        Manage Bookings
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        View transaction receipts or cancel bookings
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;