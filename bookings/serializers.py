from rest_framework import serializers
from .models import Booking, Ticket

class BookingCreateSerializer(serializers.Serializer):
    event_id = serializers.IntegerField()
    ticket_count = serializers.IntegerField(min_value=1)

class TicketSerializer(serializers.ModelSerializer):

    qr_code = serializers.ImageField(read_only=True)

    class Meta:
        model = Ticket
        fields = [
            'ticket_uuid',
            'qr_code',
            'is_checked_in'
        ]

from rest_framework import serializers

from .models import Ticket


class MyTicketSerializer(
    serializers.ModelSerializer
):

    event_title = serializers.CharField(
        source="booking.event.title",
        read_only=True
    )

    event_date = serializers.DateTimeField(
        source="booking.event.date_time",
        read_only=True
    )

    class Meta:

        model = Ticket

        fields = [

            "id",
            "ticket_uuid",
            "is_checked_in",

            "event_title",
            "event_date",
        ]

class BookingSerializer(serializers.ModelSerializer):
    tickets = TicketSerializer(many=True, read_only=True)
    event_title = serializers.ReadOnlyField(source='event.title')

    class Meta:
        model = Booking
        fields = [
            'id',
            'event',
            'event_title',
            'ticket_count',
            'total_price',
            'status',
            'booked_at',
            'tickets'
        ]       