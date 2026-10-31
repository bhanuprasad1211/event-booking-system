import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
    const { accessToken, logout } = useContext(AuthContext);
    
    // Retrieve the role saved in localStorage during login
    const userRole = localStorage.getItem("role");

    return (
        <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50 border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* LEFT SIDE: Logo & Public Links */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
                            <span className="text-blue-500">Event</span>Booking
                        </Link>
                        
                        <div className="hidden md:flex gap-6">
                            <Link to="/events" className="text-gray-300 hover:text-white font-medium transition-colors">
                                Browse Events
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Auth & Dashboard Links */}
                    <div className="flex items-center gap-6">
                        {!accessToken ? (
                            // UNAUTHENTICATED STATE
                            <>
                                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm">
                                    Register
                                </Link>
                            </>
                        ) : (
                            // AUTHENTICATED STATE
                            <div className="flex items-center gap-4 sm:gap-6">
                                <Link to="/dashboard" className="text-gray-300 hover:text-white text-sm sm:text-base font-medium transition-colors">
                                    Dashboard
                                </Link>
                                
                                <Link to="/my-bookings" className="text-gray-300 hover:text-white text-sm sm:text-base font-medium transition-colors">
                                    My Bookings
                                </Link>
                                
                                <Link to="/my-tickets" className="text-gray-300 hover:text-white text-sm sm:text-base font-medium transition-colors">
                                    My Tickets
                                </Link>

                                {/* CONDITIONAL RENDERING: Only visible if the role is 'ORGANIZER' */}
                                {userRole === "ORGANIZER" && (
                                    <Link to="/organizer" className="text-gray-300 hover:text-white text-sm sm:text-base font-medium transition-colors border-l border-gray-700 pl-4">
                                        Host
                                    </Link>
                                )}

                                <button
                                    onClick={logout}
                                    className="text-red-400 hover:bg-red-500/10 hover:text-red-300 font-semibold px-4 py-2 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                    
                </div>
            </div>
        </nav>
    );
};

export default Navbar;