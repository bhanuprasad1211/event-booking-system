import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { accessToken, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                
                {/* Brand / Logo */}
                <Link 
                    to="/" 
                    className="flex items-center gap-2 text-lg sm:text-xl font-extrabold text-white tracking-tight group"
                >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition-transform">
                        🎟️
                    </span>
                    <span>
                        Event<span className="text-blue-500">Hub</span>
                    </span>
                </Link>

                {/* Center / Navigation Links */}
                <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
                    <Link 
                        to="/events" 
                        className="hover:text-white transition-colors"
                    >
                        Browse Events
                    </Link>
                    {accessToken && (
                        <Link 
                            to="/my-bookings" 
                            className="hover:text-white transition-colors"
                        >
                            My Bookings
                        </Link>
                    )}
                </nav>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {!accessToken ? (
                        <>
                            <Link 
                                to="/login"
                                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                            >
                                Log in
                            </Link>

                            <Link 
                                to="/register"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Sign up
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link 
                                to={role === "ORGANIZER" ? "/organizer" : "/dashboard"}
                                className="px-3.5 py-1.5 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="px-3.5 py-1.5 text-sm font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;