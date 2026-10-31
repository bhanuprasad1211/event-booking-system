import EventListPage
from "../pages/events/EventListPage";

import EventCheckInPage from "../pages/organizer/EventCheckInPage";

import EventDetailsPage
from "../pages/events/EventDetailsPage";

import MyTicketsPage
from "../pages/dashboard/MyTicketsPage";

import OrganizerDashboard
from "../pages/organizer/OrganizerDashboard";

import DashboardRedirect
from "../pages/dashboard/DashboardRedirect";

import EventAnalyticsPage from "../pages/organizer/EventAnalyticsPage";
import EventAttendeesPage from "../pages/organizer/EventAttendeesPage";

import {
    
    Routes,
    Route
} from "react-router-dom";

import HomePage
from "../pages/HomePage";

import LoginPage
from "../pages/auth/LoginPage";

import RegisterPage
from "../pages/auth/RegisterPage";

import UserDashboard
from "../pages/dashboard/UserDashboard";

import MyBookingsPage
from "../pages/dashboard/MyBookingsPage";

import ProtectedRoute
from "./ProtectedRoute";

import CreateEventPage
from "../pages/organizer/CreateEventPage";

import EditEventPage
from "../pages/organizer/EditEventPage";

const AppRoutes = () => {

    return (


            <Routes>
                <Route
                    path="/events"
                    element={<EventListPage />}
                />

                <Route
                    path="/events/:id"
                    element={<EventDetailsPage />}
                />

                <Route
                    path="/"
                    element={<HomePage />}
                />

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                <Route
                    path="/register"
                    element={<RegisterPage />}
                />

                <Route
                    path="/my-bookings"
                    element={<MyBookingsPage />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-tickets"
                    element={<MyTicketsPage />}
                />

                <Route
                    path="/organizer"
                    element={
                        <ProtectedRoute>
                            <OrganizerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/organizer/create"
                    element={
                        <ProtectedRoute>
                            <CreateEventPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/organizer/edit/:id"
                    element={<EditEventPage />}
                />

                <Route
                    path="/organizer/analytics/:id"
                    element={
                        <ProtectedRoute>
                            <EventAnalyticsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/organizer/attendees/:id"
                    element={
                        <ProtectedRoute>
                            <EventAttendeesPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/organizer/check-in/:id"
                    element={
                        <ProtectedRoute>
                            <EventCheckInPage />
                        </ProtectedRoute>
                    }
                />

            </Routes>

            

    );
};

export default AppRoutes;