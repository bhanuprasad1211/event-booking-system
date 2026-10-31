import {
    useState
} from "react";

import {
    createEvent
} from "../../api/organizerApi";

const CreateEventPage = () => {

    const [formData,
        setFormData] = useState({

        title: "",

        description: "",

        category: "CONCERT",

        location: "",

        date_time: "",

        capacity: "",

        price: "",

        is_published: false,
    });

    const [loading,
        setLoading] =
            useState(false);

    const handleChange =
        (e) => {

            const {
                name,
                value,
                type,
                checked
            } = e.target;

            setFormData({

                ...formData,

                [name]:
                    type === "checkbox"
                        ? checked
                        : value
            });
        };

    const handleSubmit =
    async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            await createEvent(formData);

            alert(
                "Event Created Successfully"
            );

            setFormData({

                title: "",

                description: "",

                category: "CONCERT",

                location: "",

                date_time: "",

                capacity: "",

                price: "",
            });

        } catch (error) {

            console.log(error.response?.data);

            alert(
                "Failed To Create Event"
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div
            className="
                max-w-3xl
                mx-auto
                p-6
            "
        >

            <h1
                className="
                    text-4xl
                    font-bold
                    mb-8
                "
            >
                Create Event
            </h1>

            <form
                onSubmit={handleSubmit}
                className="
                    flex
                    flex-col
                    gap-4
                "
            >

                <input
                    type="text"
                    name="title"
                    placeholder="Event Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="
                        border
                        p-3
                        rounded-lg
                    "
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="
                        border
                        p-3
                        rounded-lg
                        h-32
                    "
                />

                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="
                        border
                        p-3
                        rounded-lg
                    "
                >

                    <option value="CONCERT">
                        Concert
                    </option>

                    <option value="WORKSHOP">
                        Workshop
                    </option>

                    <option value="SPORTS">
                        Sports
                    </option>

                    <option value="CONFERENCE">
                        Conference
                    </option>

                </select>

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="
                        border
                        p-3
                        rounded-lg
                    "
                />

                <input
                    type="datetime-local"
                    name="date_time"
                    value={formData.date_time}
                    onChange={handleChange}
                    required
                    className="
                        border
                        p-3
                        rounded-lg
                    "
                />

                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                    className="
                        border
                        p-3
                        rounded-lg
                    "
                />

                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="
                        border
                        p-3
                        rounded-lg
                    "
                />

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <input
                        type="checkbox"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleChange}
                    />

                    <label>
                        Publish Event Immediately
                    </label>

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="
                        bg-black
                        text-white
                        py-3
                        rounded-lg
                        hover:bg-gray-800
                    "
                >

                    {
                        loading
                        ? "Creating..."
                        : "Create Event"
                    }

                </button>

            </form>

        </div>
    );
};

export default CreateEventPage;