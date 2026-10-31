from rest_framework import serializers
from .models import Event
from django.utils import timezone

class EventSerializer(serializers.ModelSerializer):
    organizer = serializers.ReadOnlyField(source='organizer.username')
    
    class Meta:
        model = Event
        fields = [
    'id',
    'title',
    'description',
    'organizer',
    'category',
    'location',
    'date_time',
    'capacity',
    'available_tickets',
    'price',
    'is_published',
    'is_cancelled',
    'created_at',
]
        
        read_only_fields = [
            'organizer',
            'available_tickets',
            'is_cancelled',
            'created_at',
        ]

    def validate_date_time(self, value):

        if value <= timezone.now():
            raise serializers.ValidationError(
                "Event date must be in future"
            )

        return value
    def validate_capacity(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                "Capacity must be greater than zero"
            )

        return value
    def validate_price(self, value):

        if value < 0:
            raise serializers.ValidationError(
                "Price cannot be negative"
            )

        return value