import {
    useEffect,
    useState
} from "react";

import {
    fetchEvents
} from "../../api/eventApi";

import EventCard
from "../../components/cards/EventCard";

const EventListPage = () => {

    const [events, setEvents] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const loadEvents =
        async () => {

            try {

                const data =
                    await fetchEvents();

                console.log(data);

                setEvents(data.results || data);

            } catch (error) {

                console.log(error);

            } finally {

                setLoading(false);
            }
        };

        loadEvents();

    }, []);

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
                    max-w-7xl
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
                    Browse Events
                </h1>

                <p
                    className="
                        text-gray-600
                        text-center
                        mb-12
                        text-lg
                    "
                >
                    Discover amazing events and book your tickets today
                </p>

                <div
                    className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-3
                        gap-8
                    "
                >

                    {events.map((event) => (

                        <EventCard
                            key={event.id}
                            event={event}
                        />

                    ))}

                </div>

                {events.length === 0 && (
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
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                            No events found
                        </h3>
                        <p
                            className="
                                text-gray-500
                            "
                        >
                            Check back later for upcoming events
                        </p>
                    </div>
                )}

            </div>

        </div>
    );
};

export default EventListPage;