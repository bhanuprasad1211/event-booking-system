from django.urls import path
from .views import (
    CreateBookingView,
    CancelBookingView,
    MyBookingsView,
    MyTicketsView
)

urlpatterns = [
    path('create/', CreateBookingView.as_view()),
    path('my-bookings/', MyBookingsView.as_view()),
    path('cancel/<int:booking_id>/', CancelBookingView.as_view()),
    path(
    "my-tickets/",
    MyTicketsView.as_view()
),
]