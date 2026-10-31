import {
    useEffect,
    useState
} from "react";

import { QRCodeSVG }
from "qrcode.react";

import {
    fetchMyTickets
} from "../../api/ticketApi";

import jsPDF from "jspdf";
import { toPng }
from "html-to-image";

const MyTicketsPage = () => {

    const [tickets,
        setTickets] =
            useState([]);

    const [loading,
        setLoading] =
            useState(true);

    useEffect(() => {

        loadTickets();

    }, []);

    const loadTickets =
    async () => {

        try {

            const data =
                await fetchMyTickets();

            setTickets(
                data.results || data
            );

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);
        }
    };

    // DOWNLOAD PDF
    const downloadTicket =
async (ticketId) => {

    try {

        const ticketElement =
            document.getElementById(
                `ticket-${ticketId}`
            );

        if (!ticketElement) {

            alert(
                "Ticket element not found"
            );

            return;
        }

        // CONVERT TO IMAGE
        const dataUrl =
            await toPng(
                ticketElement,
                {
                    cacheBust: true,
                    pixelRatio: 2
                }
            );

        // CREATE PDF
        const pdf =
            new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4"
            });

        const pdfWidth =
            pdf.internal
                .pageSize
                .getWidth();

        const imgProps =
            pdf.getImageProperties(
                dataUrl
            );

        const pdfHeight =
            (
                imgProps.height *
                pdfWidth
            ) / imgProps.width;

        pdf.addImage(
            dataUrl,
            "PNG",
            20,
            20,
            pdfWidth - 40,
            pdfHeight
        );

        pdf.save(
            `ticket-${ticketId}.pdf`
        );

    } catch (error) {

        console.log(error);

        alert(
            "PDF Download Failed"
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

    if (tickets.length === 0) {
        return (
            <div
                className="
                    max-w-6xl
                    mx-auto
                    p-6
                    text-center
                "
            >
                <h1
                    className="
                        text-4xl
                        font-bold
                        mb-8
                    "
                >
                    My Tickets
                </h1>
                <div
                    className="
                        bg-gray-50
                        rounded-lg
                        p-12
                    "
                >
                    <p
                        className="
                            text-gray-500
                            text-lg
                        "
                    >
                        No tickets found.
                    </p>
                </div>
            </div>
        );
    }

    return (

        <div
            className="
                max-w-7xl
                mx-auto
                p-6
                bg-gray-50
                min-h-screen
            "
        >

            <h1
                className="
                    text-4xl
                    font-bold
                    mb-2
                    text-gray-900
                "
            >
                My Tickets
            </h1>
            
            <p
                className="
                    text-gray-600
                    mb-8
                "
            >
                You have {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
            </p>

            <div
                className="
                    grid
                    md:grid-cols-2
                    gap-8
                "
            >

                {tickets.map((ticket) => (

                    <div
                        id={`ticket-${ticket.id}`}

                        key={ticket.id}

                        className="
                            rounded-2xl
                            shadow-lg
                            bg-white
                            overflow-hidden
                            transition-transform
                            hover:scale-[1.02]
                            duration-300
                        "

                        style={{
                            backgroundColor: "#ffffff",
                            color: "#000000"
                        }}
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
                                {ticket.event_title}
                            </h2>
                            <p
                                className="
                                    text-blue-100
                                    text-sm
                                "
                            >
                                Ticket ID: {ticket.ticket_uuid}
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
                                        ${ticket.is_checked_in 
                                            ? 'bg-gray-100 text-gray-800' 
                                            : 'bg-green-100 text-green-800'
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            w-2
                                            h-2
                                            rounded-full
                                            mr-2
                                            ${ticket.is_checked_in 
                                                ? 'bg-gray-500' 
                                                : 'bg-green-500'
                                            }
                                        `}
                                    />
                                    {ticket.is_checked_in
                                    ? "Checked In"
                                    : "Valid"}
                                </span>
                            </div>

                            {/* QR Code Section */}
                            <div
                                className="
                                    flex
                                    justify-center
                                    mb-6
                                    p-4
                                    bg-gray-50
                                    rounded-xl
                                "
                            >
                                <div
                                    className="
                                        bg-white
                                        p-3
                                        rounded-lg
                                        shadow-md
                                    "
                                >
                                    <QRCodeSVG
                                        value={
                                            ticket.ticket_uuid
                                        }
                                        size={160}
                                    />
                                </div>
                            </div>

                            {/* Ticket Details */}
                            <div
                                className="
                                    space-y-2
                                    mb-6
                                    text-sm
                                    text-gray-600
                                    border-t
                                    border-gray-100
                                    pt-4
                                "
                            >
                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >
                                    <span
                                        className="
                                            font-medium
                                        "
                                    >
                                        Ticket Type:
                                    </span>
                                    <span>
                                        General Admission
                                    </span>
                                </div>
                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >
                                    <span
                                        className="
                                            font-medium
                                        "
                                    >
                                        Issue Date:
                                    </span>
                                    <span>
                                        {new Date().toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Download Button */}
                            <button

                                onClick={() =>
                                    downloadTicket(
                                        ticket.id
                                    )
                                }

                                className="
                                    w-full
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    font-medium
                                    px-6
                                    py-3
                                    rounded-xl
                                    transition-colors
                                    duration-200
                                    flex
                                    items-center
                                    justify-center
                                    gap-2
                                    shadow-md
                                    hover:shadow-lg
                                "
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
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                Download Ticket (PDF)
                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default MyTicketsPage;