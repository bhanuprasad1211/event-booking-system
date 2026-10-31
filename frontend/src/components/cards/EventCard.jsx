import {
    Link
} from "react-router-dom";

const EventCard = ({ event }) => {

    return (

        <div
            className="
                bg-white
                rounded-xl
                shadow-md
                overflow-hidden
                hover:shadow-xl
                transition
                duration-300
            "
        >

            <div
                className="
                    p-5
                "
            >

                <h2
                    className="
                        text-2xl
                        font-bold
                        mb-2
                    "
                >
                    {event.title}
                </h2>

                <p
                    className="
                        text-gray-600
                        mb-4
                    "
                >
                    {event.location}
                </p>

                <p
                    className="
                        text-lg
                        font-semibold
                        mb-4
                    "
                >
                    ₹{event.price}
                </p>

                <Link
                    to={`/events/${event.id}`}
                    className="
                        bg-blue-600
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        inline-block
                    "
                >
                    View Details
                </Link>

            </div>

        </div>
    );
};

export default EventCard;