from django.shortcuts import render
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from events.models import Event
from .models import Booking, Ticket
from .serializers import (
    BookingCreateSerializer,
    BookingSerializer,MyTicketSerializer
)

from notifications.tasks import send_booking_confirmation_email

from .throttles import BookingThrottle

# Create your views here.


from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

class CreateBookingView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    throttle_classes = [BookingThrottle]

    @transaction.atomic
    def post(self, request):
        serializer = BookingCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        event_id = serializer.validated_data['event_id']
        ticket_count = serializer.validated_data['ticket_count']

        # LOCK THE EVENT ROW (safely handle not found)
        try:
            event = Event.objects.select_for_update().get(id=event_id)
        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 1. EXPIRY CHECK
        # Use timezone.now() if your event date field is DateTimeField.
        # Use timezone.now().date() if event date field is DateField.
        current_time = timezone.now()  # or timezone.now().date()
        
        # Replace `event.event_date` with your actual field name (e.g., event.date, event.start_time)
        if event.date_time < current_time:
            return Response(
                {"error": "This event has already expired. Bookings are closed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Status checks
        if event.is_cancelled:
            return Response(
                {"error": "Event is cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not event.is_published:
            return Response(
                {"error": "Event is not published"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if event.available_tickets < ticket_count:
            return Response(
                {"error": "Not enough tickets available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Deduct tickets safely
        event.available_tickets -= ticket_count
        event.save()

        total_price = event.price * ticket_count

        # Create booking
        booking = Booking.objects.create(
            user=request.user,
            event=event,
            ticket_count=ticket_count,
            total_price=total_price
        )

        # Bulk create individual tickets instead of running N INSERT queries in a loop
        tickets = [Ticket(booking=booking) for _ in range(ticket_count)]
        Ticket.objects.bulk_create(tickets)

        # Dispatch Celery task ONLY AFTER the transaction commits successfully
        transaction.on_commit(
            lambda: send_booking_confirmation_email.delay(booking.id)
        )

        response_serializer = BookingSerializer(booking)

        print(">>> DEBUG DATES <<<")
        print("EVENT DATE_TIME :", event.date_time)
        print("CURRENT TIME (now):", timezone.now())
        print("IS EXPIRED?     :", event.date_time < timezone.now())
        
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
    
class CancelBookingView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request, booking_id):

        booking = get_object_or_404(
            Booking.objects.select_for_update(),
            id=booking_id,
            user=request.user
        )

        if booking.status == 'CANCELLED':
            return Response(
                {"error": "Booking already cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        event = Event.objects.select_for_update().get(id=booking.event.id)

        # Restore tickets
        event.available_tickets += booking.ticket_count
        event.save()

        booking.status = 'CANCELLED'
        booking.save()

        return Response(
            {"message": "Booking cancelled successfully"},
            status=status.HTTP_200_OK
        )
    
from rest_framework import generics

class MyBookingsView(generics.ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)


class MyTicketsView(APIView):

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get(self, request):

        tickets = Ticket.objects.select_related(
            "booking",
            "booking__event"
        ).filter(
            booking__user=request.user
        ).order_by("-id")

        serializer = MyTicketSerializer(
            tickets,
            many=True
        )

        return Response(serializer.data)