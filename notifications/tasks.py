from celery import shared_task

from django.core.mail import EmailMessage

from bookings.models import Booking

from django.utils import timezone
from datetime import timedelta

@shared_task
def send_booking_confirmation_email(booking_id):

    try:
        booking = Booking.objects.select_related(
            'user',
            'event'
        ).prefetch_related('tickets').get(id=booking_id)

    except Booking.DoesNotExist:
        return

    subject = f"Booking Confirmation - {booking.event.title}"

    message = f"""
    Hello {booking.user.username},

    Your booking has been confirmed.

    Event: {booking.event.title}
    Tickets: {booking.ticket_count}
    Total Price: ₹{booking.total_price}

    Thank you for booking with us.
    """

    email = EmailMessage(
        subject,
        message,
        to=[booking.user.email]
    )

    # Attach QR Codes
    for ticket in booking.tickets.all():

        if ticket.qr_code:
            email.attach_file(ticket.qr_code.path)

    email.send()

@shared_task
def send_event_reminder_emails():

    now = timezone.now()

    reminder_time_start = now + timedelta(hours=23)
    reminder_time_end = now + timedelta(hours=24)

    bookings = Booking.objects.select_related(
        'user',
        'event'
    ).filter(
        status='CONFIRMED',
        event__date_time__range=(
            reminder_time_start,
            reminder_time_end
        )
    )

    for booking in bookings:

        subject = f"Reminder: {booking.event.title} is Tomorrow"

        message = f"""
        Hello {booking.user.username},

        Reminder for your upcoming event.

        Event: {booking.event.title}
        Date: {booking.event.date_time}
        Location: {booking.event.location}

        See you there!
        """

        email = EmailMessage(
            subject,
            message,
            to=[booking.user.email]
        )

        email.send()