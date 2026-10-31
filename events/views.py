from requests import Response
from rest_framework import generics, permissions, filters
from .models import Event
from rest_framework.permissions import AllowAny,IsAuthenticated
from .serializers import EventSerializer
from .permissions import IsOrganizer, IsEventOwner
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from bookings.models import Booking
from bookings.models import Ticket

from django.db.models import Sum

from .models import Event
from .serializers import EventSerializer



class CreateEventView(generics.CreateAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsOrganizer]

    def perform_create(self, serializer):
        serializer.save(organizer=self.request.user)

class ListEventView(generics.ListAPIView):
    queryset = Event.objects.filter(is_published=True, is_cancelled=False)
    serializer_class = EventSerializer

    permission_classes = [permissions.AllowAny]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = ['category', 'location']
    search_fields = ['title', 'description']
    ordering_fields = ['date_time', 'price']

class OrganizerEventListView(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsOrganizer]

    def get_queryset(self):
        return Event.objects.filter(organizer=self.request.user)
    
class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    # permission_classes = [IsOrganizer,IsEventOwner]
    permission_classes=[AllowAny]
    queryset = Event.objects.filter(
        is_published=True
    ).order_by('-date_time')


    # def get_queryset(self):
    #     return Event.objects.filter(organizer=self.request.user)
    def get_permissions(self):
        if self.request.method in ['GET']:
            return [AllowAny()]
        return super().get_permissions()
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from .models import Event
from bookings.models import Booking # Make sure to import Booking correctly

class EventAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # 1. Safely get the event
        event = get_object_or_404(Event, pk=pk, organizer=request.user)

        # 2. FIXED: Filter by 'status="CONFIRMED"' instead of payment_status
        bookings = Booking.objects.filter(
            event=event,
            status="CONFIRMED" 
        )

        # 3. Calculate analytics
        total_bookings = bookings.count()

        total_tickets = bookings.aggregate(
            Sum("ticket_count")
        )["ticket_count__sum"] or 0

        revenue = bookings.aggregate(
            Sum("total_price")
        )["total_price__sum"] or 0

        return Response({
            "event": event.title,
            "total_bookings": total_bookings,
            "total_tickets": total_tickets,
            "revenue": revenue
        })
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Event
from bookings.models import Booking

class EventAttendeesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        # Safely get the event ensuring the user is the organizer
        event = get_object_or_404(Event, pk=pk, organizer=request.user)

        # Get all confirmed bookings for this event
        bookings = Booking.objects.filter(
            event=event,
            status="CONFIRMED"
        ).select_related('user') # Optimizes database query

        attendees_list = []
        for booking in bookings:
            # Try to get first/last name, fallback to username
            full_name = f"{booking.user.first_name} {booking.user.last_name}".strip()
            if not full_name:
                full_name = booking.user.username

            attendees_list.append({
                "id": booking.id,
                "name": full_name,
                "email": booking.user.email,
                "ticket_count": booking.ticket_count,
                "booked_at": booking.booked_at,
            })

        return Response(attendees_list)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Event

class DeleteEventView(APIView):
    permission_classes = [IsAuthenticated]

    # Changed 'slug' to 'pk' so it perfectly matches your React API call
    def delete(self, request, pk):
        event = get_object_or_404(Event, pk=pk, organizer=request.user)
        event.delete()
        return Response({"message": "Deleted successfully"})

class PublishEventView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        event = get_object_or_404(Event, pk=pk, organizer=request.user)
        event.is_published = True
        event.save()
        return Response({"message": "Event published"})
    
class UnpublishEventView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        event = get_object_or_404(Event, pk=pk, organizer=request.user)
        event.is_published = False
        event.save()
        return Response({"message": "Event unpublished"})

class UpdateEventView(RetrieveUpdateAPIView):

    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Event.objects.filter(
            organizer=self.request.user
        )