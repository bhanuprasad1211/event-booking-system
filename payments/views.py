from django.shortcuts import render
from decimal import Decimal

from django.db import transaction

from redis import event
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status

from django.conf import settings

import razorpay

from bookings.models import Booking,Ticket
from events.models import Event
from notifications.tasks import send_booking_confirmation_email

from .models import Payment
from .services import client

from django.utils import timezone
from datetime import timedelta

from bookings.tasks import expire_booking
# Create your views here.


from datetime import timedelta
from django.utils import timezone
from django.db import transaction
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

# Make sure imports for Event, Booking, Payment, client, expire_booking are present

class CreatePaymentOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        event_id = request.data.get('event_id')
        ticket_count_raw = request.data.get('ticket_count')

        if not event_id or not ticket_count_raw:
            return Response(
                {"error": "event_id and ticket_count are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            ticket_count = int(ticket_count_raw)
            if ticket_count <= 0:
                raise ValueError
        except ValueError:
            return Response(
                {"error": "ticket_count must be a positive integer"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            event = Event.objects.get(
                id=event_id,
                is_published=True
            )
        except Event.DoesNotExist:
            return Response(
                {"error": "Event not found or not published"},
                status=status.HTTP_404_NOT_FOUND
            )

        # 1. Event Expiry Check
        if event.date_time < timezone.now():
            return Response(
                {"error": "This event has already expired. Bookings and payments are closed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 2. Event Cancellation Check
        if event.is_cancelled:
            return Response(
                {"error": "This event has been cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3. Quick initial ticket availability check
        if ticket_count > event.available_tickets:
            return Response(
                {"error": "Not enough tickets available"},
                status=status.HTTP_400_BAD_REQUEST
            )

        total_price = event.price * ticket_count
        expiry_time = timezone.now() + timedelta(minutes=5)

        # External Razorpay order creation
        try:
            razorpay_order = client.order.create({
                "amount": int(float(total_price) * 100),
                "currency": "INR",
                "payment_capture": 1
            })
        except Exception as e:
            return Response(
                {"error": f"Failed to create payment order: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # DB Transaction block
        with transaction.atomic():
            locked_event = Event.objects.select_for_update().get(id=event.id)

            # Re-check after locking to avoid race condition overselling
            if ticket_count > locked_event.available_tickets:
                return Response(
                    {"error": "Tickets sold out"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Reserve tickets
            locked_event.available_tickets -= ticket_count
            locked_event.save()

            # Create pending booking
            booking = Booking.objects.create(
                user=request.user,
                event=locked_event,
                ticket_count=ticket_count,
                total_price=total_price,
                status='PENDING',
                expires_at=expiry_time
            )

            payment = Payment.objects.create(
                booking=booking,
                razorpay_order_id=razorpay_order['id'],
                amount=total_price
            )

            # Trigger Celery task only after database transaction commits
            booking_id = booking.id
            transaction.on_commit(
                lambda: expire_booking.apply_async(
                    args=[booking_id],
                    countdown=300
                )
            )

        return Response({
            "booking_id": booking.id,
            "razorpay_order_id": payment.razorpay_order_id,
            "amount": payment.amount,
            "key": settings.RAZORPAY_KEY_ID
        }, status=status.HTTP_201_CREATED)
    
class VerifyPaymentView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        razorpay_order_id = request.data.get(
            'razorpay_order_id'
        )

        razorpay_payment_id = request.data.get(
            'razorpay_payment_id'
        )

        razorpay_signature = request.data.get(
            'razorpay_signature'
        )

        if booking.status == 'CANCELLED':

            return Response(
                {"error": "Booking expired"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            payment = Payment.objects.select_related(
                'booking',
                'booking__event'
            ).get(
                razorpay_order_id=razorpay_order_id
            )

        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        client.utility.verify_payment_signature({
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        })

        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'SUCCESS'

        payment.save()

        booking = payment.booking

        booking.status = 'CONFIRMED'
        booking.save()

        # Generate tickets AFTER payment success
        for _ in range(booking.ticket_count):
            Ticket.objects.create(
                booking=booking
            )

        # Send confirmation email
        send_booking_confirmation_email.delay(
            booking.id
        )

        return Response({
            "message": "Payment verified successfully"
        })
        

class VerifyPaymentView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        razorpay_order_id = request.data.get(
            'razorpay_order_id'
        )

        razorpay_payment_id = request.data.get(
            'razorpay_payment_id'
        )

        razorpay_signature = request.data.get(
            'razorpay_signature'
        )

        try:
            payment = Payment.objects.select_related(
                'booking',
                'booking__event'
            ).get(
                razorpay_order_id=razorpay_order_id
            )

        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Prevent duplicate verification
        if payment.status == 'SUCCESS':

            return Response({
                "message": "Payment already verified"
            })

        try:

            # Verify cryptographic signature
            client.utility.verify_payment_signature({
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            })

        except razorpay.errors.SignatureVerificationError:

            # Rollback tickets
            booking = payment.booking
            event = booking.event

            event.available_tickets += booking.ticket_count
            event.save()

            payment.status = 'FAILED'
            payment.save()

            booking.status = 'FAILED'
            booking.save()

            return Response(
                {"error": "Invalid payment signature"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Payment successful
        payment.razorpay_payment_id = razorpay_payment_id
        payment.razorpay_signature = razorpay_signature
        payment.status = 'SUCCESS'

        payment.save()

        booking = payment.booking

        booking.status = 'CONFIRMED'
        booking.save()

        # Generate tickets
        for _ in range(booking.ticket_count):

            Ticket.objects.create(
                booking=booking
            )

        # Send email async
        send_booking_confirmation_email.delay(
            booking.id
        )

        return Response({
            "message": "Payment verified successfully"
        })
    
class PaymentFailureView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):

        razorpay_order_id = request.data.get(
            'razorpay_order_id'
        )

        try:
            payment = Payment.objects.select_related(
                'booking',
                'booking__event'
            ).get(
                razorpay_order_id=razorpay_order_id
            )

        except Payment.DoesNotExist:
            return Response(
                {"error": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if payment.status == 'SUCCESS':

            return Response({
                "error": "Payment already successful"
            })

        booking = payment.booking
        event = booking.event

        # Restore seats
        event.available_tickets += booking.ticket_count
        event.save()

        payment.status = 'FAILED'
        payment.save()

        booking.status = 'FAILED'
        booking.save()

        return Response({
            "message": "Payment marked as failed"
        })
    
def payment_test_page(request):

    return render(
        request,
        'payment_test.html'
    )