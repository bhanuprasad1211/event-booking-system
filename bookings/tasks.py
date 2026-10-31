from celery import shared_task

from django.db import transaction
from django.utils import timezone

from .models import Booking

@shared_task
def expire_booking(booking_id):

    try:

        booking = Booking.objects.select_related(
            'event'
        ).get(
            id=booking_id
        )

    except Booking.DoesNotExist:
        return

    # Ignore already completed bookings
    if booking.status != 'PENDING':
        return

    # Check expiry time
    if timezone.now() < booking.expires_at:
        return

    with transaction.atomic():

        event = booking.event

        # Restore tickets
        event.available_tickets += booking.ticket_count
        event.save()

        booking.status = 'CANCELLED'
        booking.save()

        print(
            f"Booking {booking.id} expired"
        )