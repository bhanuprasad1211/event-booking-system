import {
    useEffect,
    useState
} from "react";

import {
    fetchMyBookings,
    cancelBooking
} from "../../api/bookingApi";

const MyBookingsPage = () => {

    const [bookings,
        setBookings] =
            useState([]);

    const [loading,
        setLoading] =
            useState(true);

    useEffect(() => {

        loadBookings();

    }, []);

    const loadBookings =
    async () => {

        try {

            const data =
                await fetchMyBookings();

            setBookings(
                data.results || data
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    const handleCancel =
    async (bookingId) => {

        try {

            await cancelBooking(
                bookingId
            );

            alert(
                "Booking Cancelled"
            );

            loadBookings();

        } catch (error) {

            console.log(error);

            alert(
                "Cancel Failed"
            );
        }
    };

    if (loading) {

        return (
            <div
                className="
                    flex
                    justify-center
                    items-center
                    min-h-[400px]
                "
            >
                <div
                    className="
                        animate-spin
                        rounded-full
                        h-12
                        w-12
                        border-b-2
                        border-blue-600
                    "
                />
            </div>
        );
    }

    return (

        <div
            className="
                min-h-screen
                bg-gray-50
                py-12
                px-4
            "
        >

            <div
                className="
                    max-w-6xl
                    mx-auto
                "
            >

                <h1
                    className="
                        text-4xl
                        md:text-5xl
                        font-bold
                        text-gray-900
                        mb-4
                        text-center
                    "
                >
                    My Bookings
                </h1>

                <p
                    className="
                        text-gray-600
                        text-center
                        mb-12
                        text-lg
                    "
                >
                    {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                </p>

                {bookings.length === 0 ? (
                    <div
                        className="
                            text-center
                            py-12
                            bg-white
                            rounded-2xl
                            shadow-sm
                        "
                    >
                        <svg
                            className="
                                w-16
                                h-16
                                mx-auto
                                text-gray-400
                                mb-4
                            "
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 18v3"
                            />
                        </svg>
                        <h3
                            className="
                                text-xl
                                font-semibold
                                text-gray-700
                                mb-2
                            "
                        >
                            No bookings found
                        </h3>
                        <p
                            className="
                                text-gray-500
                            "
                        >
                            You haven't made any bookings yet
                        </p>
                    </div>
                ) : (
                    <div
                        className="
                            grid
                            md:grid-cols-2
                            gap-8
                        "
                    >

                        {bookings.map((booking) => (

                            <div
                                key={booking.id}

                                className="
                                    bg-white
                                    rounded-2xl
                                    shadow-lg
                                    overflow-hidden
                                    transition-all
                                    duration-300
                                    hover:shadow-xl
                                    hover:-translate-y-1
                                "
                            >

                                {/* Header Section */}
                                <div
                                    className="
                                        bg-gradient-to-r
                                        from-blue-600
                                        to-blue-800
                                        px-6
                                        py-4
                                    "
                                >
                                    <h2
                                        className="
                                            text-2xl
                                            font-bold
                                            text-white
                                            mb-1
                                        "
                                    >
                                        {booking.event_title}
                                    </h2>
                                    <p
                                        className="
                                            text-blue-100
                                            text-sm
                                        "
                                    >
                                        Booking ID: {booking.id}
                                    </p>
                                </div>

                                {/* Content Section */}
                                <div
                                    className="
                                        p-6
                                    "
                                >
                                    {/* Status Badge */}
                                    <div
                                        className="
                                            mb-4
                                        "
                                    >
                                        <span
                                            className={`
                                                inline-flex
                                                items-center
                                                px-3
                                                py-1
                                                rounded-full
                                                text-sm
                                                font-medium
                                                ${booking.status === 'confirmed' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : booking.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }
                                            `}
                                        >
                                            <span
                                                className={`
                                                    w-2
                                                    h-2
                                                    rounded-full
                                                    mr-2
                                                    ${booking.status === 'confirmed' 
                                                        ? 'bg-green-500' 
                                                        : booking.status === 'cancelled'
                                                        ? 'bg-red-500'
                                                        : 'bg-yellow-500'
                                                    }
                                                `}
                                            />
                                            Status: {booking.status}
                                        </span>
                                    </div>

                                    {/* Booking Details */}
                                    <div
                                        className="
                                            space-y-3
                                            mb-6
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                justify-between
                                                items-center
                                                py-2
                                                border-b
                                                border-gray-100
                                            "
                                        >
                                            <span
                                                className="
                                                    text-gray-600
                                                    font-medium
                                                "
                                            >
                                                Tickets:
                                            </span>
                                            <span
                                                className="
                                                    text-gray-900
                                                    font-semibold
                                                "
                                            >
                                                {booking.ticket_count}
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                items-center
                                                py-2
                                                border-b
                                                border-gray-100
                                            "
                                        >
                                            <span
                                                className="
                                                    text-gray-600
                                                    font-medium
                                                "
                                            >
                                                Total Amount:
                                            </span>
                                            <span
                                                className="
                                                    text-2xl
                                                    font-bold
                                                    text-blue-600
                                                "
                                            >
                                                ₹{booking.total_price}
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                justify-between
                                                items-center
                                                py-2
                                            "
                                        >
                                            <span
                                                className="
                                                    text-gray-600
                                                    font-medium
                                                "
                                            >
                                                Per Ticket:
                                            </span>
                                            <span
                                                className="
                                                    text-gray-900
                                                "
                                            >
                                                ₹{Math.round(booking.total_price / booking.ticket_count)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cancel Button */}
                                    <button
                                        onClick={() =>
                                            handleCancel(
                                                booking.id
                                            )
                                        }

                                        disabled={booking.status === 'cancelled'}

                                        className={`
                                            w-full
                                            px-4
                                            py-3
                                            rounded-xl
                                            font-medium
                                            transition-all
                                            duration-200
                                            flex
                                            items-center
                                            justify-center
                                            gap-2
                                            ${booking.status === 'cancelled'
                                                ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                                : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                                            }
                                        `}
                                    >
                                        <svg
                                            className="
                                                w-5
                                                h-5
                                            "
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        {booking.status === 'cancelled' 
                                            ? 'Booking Cancelled' 
                                            : 'Cancel Booking'
                                        }
                                    </button>

                                </div>

                            </div>

                        ))}

                    </div>
                )}

            </div>

        </div>
    );
};

export default MyBookingsPage;