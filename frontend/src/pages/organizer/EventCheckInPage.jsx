import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Scanner } from "@yudiel/react-qr-scanner";
import { verifySignedQR, confirmTicketCheckIn } from "../../api/organizerApi";

const EventCheckInPage = () => {
    const { id } = useParams(); 
    
    const [isScanning, setIsScanning] = useState(true);
    const [ticketData, setTicketData] = useState(null);
    const [scanMessage, setScanMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    // STEP 1: Handle the initial camera scan
    const handleDecode = async (result) => {
        const qrData = result[0].rawValue;
        // ADD THIS LINE:
        console.log("SCANNED QR DATA:", qrData); 
        
        setIsScanning(false);
        setIsScanning(false); // Stop scanner immediately so it doesn't double-fire
        setLoading(true);
        setScanMessage(null);

        try {
            // Hit your VerifySignedQRCodeView
            const data = await verifySignedQR(qrData);
            setTicketData(data);
            
            if (data.checked_in) {
                setScanMessage({ type: "warning", text: "WARNING: This ticket has already been checked in!" });
            } else if (data.booking_status === "CANCELLED") {
                setScanMessage({ type: "error", text: "ERROR: This booking was cancelled." });
            }
            
        } catch (error) {
            console.error("Verification failed:", error);
            setScanMessage({ 
                type: "error", 
                text: error.response?.data?.error || "Invalid or forged QR Code!" 
            });
            // Auto-resume scanner if it's a completely bad QR code
            setTimeout(() => {
                setIsScanning(true);
                setScanMessage(null);
            }, 3000);
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Organizer clicks to confirm
    const handleConfirmCheckIn = async () => {
        setLoading(true);
        try {
            // Hit your CheckInTicketView
            await confirmTicketCheckIn(ticketData.ticket_uuid);
            
            setScanMessage({ type: "success", text: "Check-in Successful!" });
            
            // Mark as checked in locally so the UI updates
            setTicketData(prev => ({ ...prev, checked_in: true }));
            
        } catch (error) {
            setScanMessage({ 
                type: "error", 
                text: error.response?.data?.error || "Check-in failed on server." 
            });
        } finally {
            setLoading(false);
        }
    };

    // Reset scanner for the next person
    const handleScanNext = () => {
        setTicketData(null);
        setScanMessage(null);
        setIsScanning(true);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Ticket Scanner</h1>
                <Link to="/organizer" className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                    &larr; Back to Dashboard
                </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                
                {/* Dynamic Status Messages */}
                {scanMessage && (
                    <div className={`p-4 mb-6 rounded-lg font-bold text-center text-lg ${
                        scanMessage.type === 'success' ? 'bg-green-100 text-green-800' :
                        scanMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                    }`}>
                        {scanMessage.text}
                    </div>
                )}

                {/* THE CAMERA VIEWFINDER */}
                {isScanning && !ticketData && (
                    <div className="max-w-md mx-auto overflow-hidden rounded-xl border-4 border-gray-100 shadow-inner">
                        <div className="p-3 bg-blue-50 text-blue-800 text-center font-medium border-b border-gray-100">
                            Ready to scan. Point camera at QR code.
                        </div>
                        <Scanner 
                            onScan={handleDecode} 
                            formats={['qr_code']}
                        />
                    </div>
                )}

                {/* LOADING STATE */}
                {loading && (
                    <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl max-w-md mx-auto">
                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-600 font-bold">Processing...</p>
                    </div>
                )}

                {/* THE VERIFICATION CARD (Shows after successful scan) */}
                {ticketData && !loading && (
                    <div className="max-w-md mx-auto bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h3 className="text-gray-500 text-sm font-bold uppercase mb-1">Attendee</h3>
                        <p className="text-2xl font-bold mb-4">{ticketData.attendee}</p>

                        <h3 className="text-gray-500 text-sm font-bold uppercase mb-1">Event</h3>
                        <p className="text-lg font-semibold mb-6">{ticketData.event}</p>

                        <div className="space-y-3">
                            {!ticketData.checked_in && ticketData.booking_status !== "CANCELLED" ? (
                                <button 
                                    onClick={handleConfirmCheckIn}
                                    className="w-full bg-green-600 text-white font-bold py-4 rounded-lg hover:bg-green-700 transition shadow-lg"
                                >
                                    Confirm Check-In
                                </button>
                            ) : null}

                            <button 
                                onClick={handleScanNext}
                                className="w-full bg-gray-200 text-gray-800 font-bold py-4 rounded-lg hover:bg-gray-300 transition"
                            >
                                Scan Next Ticket
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default EventCheckInPage;