from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from django.core import signing

from bookings.models import Ticket
# Create your views here.

class VerifyTicketView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, ticket_uuid):

        try:
            ticket = Ticket.objects.select_related(
                'booking',
                'booking__event',
                'booking__user'
            ).get(ticket_uuid=ticket_uuid)

        except Ticket.DoesNotExist:
            return Response(
                {"error": "Invalid ticket"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "ticket_uuid": str(ticket.ticket_uuid),
            "event": ticket.booking.event.title,
            "attendee": ticket.booking.user.username,
            "checked_in": ticket.is_checked_in,
            "booking_status": ticket.booking.status
        })

class CheckInTicketView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, ticket_uuid):

        try:
            ticket = Ticket.objects.select_related(
                'booking'
            ).get(ticket_uuid=ticket_uuid)

        except Ticket.DoesNotExist:
            return Response(
                {"error": "Invalid ticket"},
                status=status.HTTP_404_NOT_FOUND
            )

        if ticket.booking.status == 'CANCELLED':
            return Response(
                {"error": "Booking cancelled"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if ticket.is_checked_in:
            return Response(
                {"error": "Ticket already checked in"},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket.is_checked_in = True
        ticket.save()

        return Response({
            "message": "Check-in successful"
        })
    
import uuid # Add this at the top of your file
from django.core import signing
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from bookings.models import Ticket

class VerifySignedQRCodeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        qr_data = request.data.get('qr_data')

        if not qr_data:
            return Response(
                {"error": "QR data required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        ticket_uuid = None

        # 1. Try to read it as a raw UUID (Old Ticket Format)
        try:
            # This checks if the string is a valid UUID format
            uuid_obj = uuid.UUID(qr_data, version=4)
            ticket_uuid = str(uuid_obj)
        except ValueError:
            # 2. If it's NOT a raw UUID, try to verify the signature (New Ticket Format)
            try:
                payload = signing.loads(qr_data)
                ticket_uuid = payload.get('ticket_uuid')
            except signing.BadSignature:
                return Response(
                    {"error": "Invalid or forged QR signature"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 3. Look up the ticket
        try:
            ticket = Ticket.objects.select_related(
                'booking',
                'booking__event',
                'booking__user'
            ).get(ticket_uuid=ticket_uuid)

        except Ticket.DoesNotExist:
            return Response(
                {"error": "Ticket not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response({
            "ticket_uuid": str(ticket.ticket_uuid),
            "event": ticket.booking.event.title,
            "attendee": ticket.booking.user.username,
            "checked_in": ticket.is_checked_in,
            "booking_status": ticket.booking.status
        })