import { Link }
from "react-router-dom";

const EventCard = ({ event }) => {

    return (

        <div
            className="
            bg-white
            shadow-lg
            rounded-xl
            p-5
            border
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
                mb-3
            "
            >
                {event.location}
            </p>

            <p
                className="
                mb-3
            "
            >
                ₹ {event.price}
            </p>

            <p
                className="
                mb-4
                text-sm
            "
            >
                {new Date(
                    event.date_time
                ).toLocaleString()}
            </p>

            <Link
                to={`/events/${event.id}`}
                className="
                bg-blue-600
                text-white
                px-4
                py-2
                rounded
            "
            >
                View Details
            </Link>

        </div>
    );
};

export default EventCard;