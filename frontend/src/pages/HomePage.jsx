import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("access") ||
            localStorage.getItem("accessToken") ||
            localStorage.getItem("authToken");

        const storedRole = localStorage.getItem("role");

        const hasValidToken = Boolean(
            token && token !== "null" && token !== "undefined" && token.trim() !== ""
        );

        setIsAuthenticated(hasValidToken);
        setRole(storedRole);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col selection:bg-blue-500 selection:text-white">
            {/* 1. HERO SECTION */}
            <section className="relative py-24 px-6 sm:py-36 lg:px-8 overflow-hidden border-b border-white/5">
                {/* Background Image Layer */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 pointer-events-none"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=80')`,
                    }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950 pointer-events-none" />

                {/* Dot Grid */}
                <div 
                    className="absolute inset-0 opacity-15 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '36px 36px'
                    }}
                />

                {/* Ambient Glows */}
                <div className="absolute -top-24 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-blue-300 mb-8 tracking-wide uppercase">
                        <span className="flex h-2 w-2 rounded-full bg-blue-400 animate-ping" />
                        Live Ticketing & Instant QR Entry
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                        Discover & Book <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
                            Incredible Events
                        </span>
                    </h1>
                    
                    <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                        From live concerts to tech workshops, find your next great experience and secure your tickets in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/events"
                            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-xl shadow-blue-600/30 transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Explore Events
                        </Link>

                        {isAuthenticated && (
                            <Link
                                to={role === "ORGANIZER" ? "/organizer" : "/dashboard"}
                                className="w-full sm:w-auto bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-bold px-8 py-4 rounded-xl text-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                            >
                                Go to Dashboard
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* 2. FEATURE HIGHLIGHTS */}
            <section className="relative py-24 px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Background Grid Pattern & Ambient Lighting */}
                <div 
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                        backgroundSize: '36px 36px'
                    }}
                />
                <div className="absolute top-1/3 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="text-center mb-16 relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Why use our platform?
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Everything you need to discover, book, and enjoy events seamlessly.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative z-10">
                    {/* Card 1 */}
                    <div className="bg-white/[0.04] backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.07] transition-all duration-300 group">
                        <div className="w-14 h-14 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                            🎟️
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Instant Booking</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Secure your spot at top events in seconds. Access your digital tickets anytime from your dashboard.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white/[0.04] backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-purple-500/40 hover:bg-white/[0.07] transition-all duration-300 group">
                        <div className="w-14 h-14 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                            🔒
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Secure Checkout</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Safe and encrypted payment processing with automated instant ticket reservation and confirmation.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white/[0.04] backdrop-blur-md p-8 rounded-2xl border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.07] transition-all duration-300 group">
                        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
                            📱
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">Fast Entry</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            Get unique digital QR codes for your booked tickets to ensure rapid, paperless verification at the door.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. FOOTER */}
            <footer className="relative bg-slate-950 text-slate-400 py-14 px-6 lg:px-8 border-t border-white/10 mt-auto overflow-hidden">
                {/* Subtle Footer Ambient Backlight */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-t from-blue-600/10 to-transparent blur-2xl pointer-events-none" />

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-10 relative z-10">
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-extrabold text-white mb-3 tracking-tight flex items-center gap-2">
                            <span className="text-blue-500">🎟️</span> EventHub
                        </h3>
                        <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                            Your premier platform for discovering live experiences, conferences, workshops, and seamless digital ticketing.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                            Explore
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to="/events" className="hover:text-blue-400 transition-colors">
                                    All Events
                                </Link>
                            </li>
                            <li>
                                <Link to="/events?category=CONCERT" className="hover:text-blue-400 transition-colors">
                                    Concerts & Music
                                </Link>
                            </li>
                            <li>
                                <Link to="/events?category=WORKSHOP" className="hover:text-blue-400 transition-colors">
                                    Workshops & Tech
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
                            Platform
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link to={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-blue-400 transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <span className="hover:text-blue-400 cursor-pointer transition-colors">
                                    Terms & Privacy
                                </span>
                            </li>
                            <li>
                                <span className="hover:text-blue-400 cursor-pointer transition-colors">
                                    Support Center
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 relative z-10">
                    <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
                    <p>Built for scale and real-time ticketing.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;