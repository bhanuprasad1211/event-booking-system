from rest_framework import serializers

class EventAnalyticsSerializer(serializers.Serializer):

    event_id = serializers.IntegerField()
    event_title = serializers.CharField()

    total_bookings = serializers.IntegerField()

    total_tickets_sold = serializers.IntegerField()

    total_revenue = serializers.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    occupancy_rate = serializers.FloatField()

    checked_in_tickets = serializers.IntegerField()

    attendance_rate = serializers.FloatField()