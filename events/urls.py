from django.urls import path
from .views import (
    CreateEventView,
    ListEventView,
    OrganizerEventListView,
    EventDetailView,
    PublishEventView,
    DeleteEventView,
    UpdateEventView
)
from .views import PublishEventView, UnpublishEventView, EventAnalyticsView, EventAttendeesView

urlpatterns = [
    path('', ListEventView.as_view()),  # public
    path('create/', CreateEventView.as_view()),
    path('my-events/', OrganizerEventListView.as_view()),
    path('<int:pk>/', EventDetailView.as_view()),
    path(
    "publish/<int:pk>/",
        PublishEventView.as_view()
        ),

path(
    "unpublish/<int:pk>/",
        UnpublishEventView.as_view()
    ),

path(
    "analytics/<int:pk>/",
    EventAnalyticsView.as_view()
),

path(
    "attendees/<int:pk>/",
        EventAttendeesView.as_view()
    ),
path(
    "delete/<int:pk>/",
    DeleteEventView.as_view()
),
path(
    "edit/<int:pk>/",
    UpdateEventView.as_view()
),

]
