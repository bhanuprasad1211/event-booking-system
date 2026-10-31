from django.urls import path

from .views import (
    OrganizerDashboardView,
    EventAnalyticsView,
    BookingTrendView
)

urlpatterns = [
    path('dashboard/', OrganizerDashboardView.as_view()),
    path('events/', EventAnalyticsView.as_view()),
    path('booking-trends/', BookingTrendView.as_view()),
]