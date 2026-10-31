import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchEventDetails } from "../../api/eventApi";
import { createPaymentOrder, verifyPayment } from "../../api/paymentApi";
import { AuthContext } from "../../context/AuthContext";

const EventDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // Auth Context to check if user is logged in
    const { accessToken } = useContext(AuthContext);

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [ticketCount, setTicketCount] = useState(1);
    const [isBooking, setIsBooking] = useState(false); // Added loading state for the booking button

    // LOAD EVENT
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await fetchEventDetails(id);
                console.log(data);
                setEvent(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvent();
    }, [id]);

    // HANDLE BOOKING
    const handleBooking = async () => {
        // Guard check: Redirect to login if not authenticated
        if (!accessToken) {
            navigate("/login");
            return;
        }

        setIsBooking(true);

        try {
            // CREATE ORDER
            const order = await createPaymentOrder({
                event_id: event.id,
                ticket_count: Number(ticketCount)
            });

            console.log(order);

            // RAZORPAY OPTIONS
            const options = {
                key: order.key,
                amount: order.amount,
                currency: "INR",
                name: "Event Booking",
                description: event.title,
                order_id: order.razorpay_order_id,
                handler: async function(response) {
                    try {
                        console.log(response);

                        // VERIFY PAYMENT
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        alert("Payment Successful!");
                        navigate("/my-tickets"); // Redirect user to their tickets after success

                    } catch (error) {
                        console.log(error);
                        alert("Payment Verification Failed");
                    }
                },
                prefill: {
                    name: "Customer"
                },
                theme: {
                    color: "#3399cc"
                }
            };

            // OPEN RAZORPAY
            const razorpay = new window.Razorpay(options);
            razorpay.open();

        } catch (error) {
            console.log(error);
            alert("Booking Failed. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    // LOADING
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    // EVENT NOT FOUND
    if (!event) {
        return (
            <div className="max-w-4xl mx-auto p-6 text-center mt-20">
                <div className="bg-red-50 border border-red-200 rounded-lg p-8">
                    <h2 className="text-2xl font-semibold text-red-700 mb-2">Event not found</h2>
                    <p className="text-red-600">
                        The event you're looking for doesn't exist or has been removed.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)} // Updated to use navigate
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                </button>

                {/* Main Event Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Event Header Image Placeholder */}
                    <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
                            <h1 className="text-3xl md:text-4xl font-bold text-white">
                                {event.title}
                            </h1>
                        </div>
                    </div>

                    {/* Event Details Content */}
                    <div className="p-6 md:p-8">
                        {/* Description */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-3">About this event</h2>
                            <p className="text-gray-600 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* Event Info Grid */}
                        <div className="grid md:grid-cols-3 gap-4 mb-8">
                            {/* Location */}
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="font-medium text-gray-900">{event.location}</p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-500">Price per ticket</p>
                                    <p className="font-bold text-2xl text-blue-600">₹{event.price}</p>
                                </div>
                            </div>

                            {/* Available Tickets */}
                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                </svg>
                                <div>
                                    <p className="text-sm text-gray-500">Available Tickets</p>
                                    <p className={`font-semibold text-lg ${event.available_tickets < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                        {event.available_tickets} left
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Booking Section */}
                        <div className="border-t border-gray-200 pt-8 mt-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Book your tickets</h2>

                            {/* Ticket Quantity */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ticket Quantity</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setTicketCount(prev => Math.max(1, prev - 1))}
                                        disabled={ticketCount <= 1}
                                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors
                                            ${ticketCount <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}
                                        `}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                        </svg>
                                    </button>
                                    
                                    <input
                                        type="number"
                                        min="1"
                                        max={event.available_tickets}
                                        value={ticketCount}
                                        onChange={(e) => setTicketCount(Math.min(event.available_tickets, Math.max(1, parseInt(e.target.value) || 1)))}
                                        className="w-24 text-center px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    
                                    <button
                                        onClick={() => setTicketCount(prev => Math.min(event.available_tickets, prev + 1))}
                                        disabled={ticketCount >= event.available_tickets}
                                        className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors
                                            ${ticketCount >= event.available_tickets ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'}
                                        `}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Total Price */}
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-700 font-medium">Total Amount:</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        ₹{event.price * ticketCount}
                                    </span>
                                </div>
                            </div>

                            {/* Book Now Button - SMART LOGIC */}
                            {!accessToken ? (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="
                                        w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                                        flex items-center justify-center gap-2
                                        bg-slate-800 hover:bg-slate-900 text-white shadow-lg hover:shadow-xl
                                    "
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Log in to Book Tickets
                                </button>
                            ) : (
                                <button
                                    onClick={handleBooking}
                                    disabled={event.available_tickets === 0 || isBooking}
                                    className={`
                                        w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200
                                        flex items-center justify-center gap-2
                                        ${event.available_tickets === 0 || isBooking
                                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                                        }
                                    `}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M18 13l1.5 6M9 21h6M12 18v3" />
                                    </svg>
                                    {event.available_tickets === 0 
                                        ? 'Sold Out' 
                                        : isBooking ? 'Processing...' : 'Book Now'
                                    }
                                </button>
                            )}

                            {/* Warning for low availability */}
                            {event.available_tickets < 10 && event.available_tickets > 0 && (
                                <p className="text-sm text-orange-600 mt-3 text-center">
                                    ⚡ Only {event.available_tickets} tickets left! Book soon.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailsPage;