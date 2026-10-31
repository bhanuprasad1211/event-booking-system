from django.shortcuts import render

from django.db.models import (
    Sum,
    Count,
    F,
    FloatField,
    ExpressionWrapper,
    Q
)

from django.db.models.functions import TruncDate

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from events.models import Event
from bookings.models import Booking, Ticket

from events.permissions import IsOrganizer

# Create your views here.

class OrganizerDashboardView(APIView):

    permission_classes = [IsOrganizer]

    def get(self, request):

        organizer = request.user

        events = Event.objects.filter(
            organizer=organizer
        )

        total_events = events.count()

        confirmed_bookings = Booking.objects.filter(
            event__organizer=organizer,
            status='CONFIRMED'
        )

        total_bookings = confirmed_bookings.count()

        total_revenue = confirmed_bookings.aggregate(
            revenue=Sum('total_price')
        )['revenue'] or 0

        total_tickets_sold = confirmed_bookings.aggregate(
            tickets=Sum('ticket_count')
        )['tickets'] or 0

        checked_in_tickets = Ticket.objects.filter(
            booking__event__organizer=organizer,
            booking__status='CONFIRMED',
            is_checked_in=True
        ).count()

        attendance_rate = 0

        if total_tickets_sold > 0:
            attendance_rate = (
                checked_in_tickets / total_tickets_sold
            ) * 100

        return Response({
            "total_events": total_events,
            "total_bookings": total_bookings,
            "total_revenue": total_revenue,
            "tickets_sold": total_tickets_sold,
            "checked_in_tickets": checked_in_tickets,
            "attendance_rate": round(attendance_rate, 2)
        })
    

class EventAnalyticsView(APIView):

    permission_classes = [IsOrganizer]

    def get(self, request):

        events = Event.objects.filter(
            organizer=request.user
        ).annotate(

            total_bookings=Count(
                'bookings',
                filter=Q(bookings__status='CONFIRMED')
            ),

            total_tickets_sold=Sum(
                'bookings__ticket_count',
                filter=Q(bookings__status='CONFIRMED')
            ),

            total_revenue=Sum(
                'bookings__total_price',
                filter=Q(bookings__status='CONFIRMED')
            ),

            checked_in_tickets=Count(
                'bookings__tickets',
                filter=Q(
                    bookings__tickets__is_checked_in=True,
                    bookings__status='CONFIRMED'
                )
            )
        )

        data = []

        for event in events:

            tickets_sold = event.total_tickets_sold or 0

            occupancy_rate = 0
            attendance_rate = 0

            if event.capacity > 0:
                occupancy_rate = (
                    tickets_sold / event.capacity
                ) * 100

            if tickets_sold > 0:
                attendance_rate = (
                    event.checked_in_tickets / tickets_sold
                ) * 100

            data.append({
                "event_id": event.id,
                "event_title": event.title,
                "total_bookings": event.total_bookings,
                "total_tickets_sold": tickets_sold,
                "total_revenue": event.total_revenue or 0,
                "occupancy_rate": round(occupancy_rate, 2),
                "checked_in_tickets": event.checked_in_tickets,
                "attendance_rate": round(attendance_rate, 2)
            })

        return Response(data)
    
class BookingTrendView(APIView):

    permission_classes = [IsOrganizer]

    def get(self, request):

        trends = Booking.objects.filter(
            event__organizer=request.user,
            status='CONFIRMED'
        ).annotate(
            booking_date=TruncDate('booked_at')
        ).values(
            'booking_date'
        ).annotate(
            total_bookings=Count('id'),
            total_revenue=Sum('total_price')
        ).order_by('booking_date')

        return Response(trends)
