from django.db import models
from django.conf import settings

from bookings.models import Booking
# Create your models here.
class Payment(models.Model):

    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
    )

    booking = models.OneToOneField(
        Booking,
        on_delete=models.CASCADE,
        related_name='payment'
    )

    razorpay_order_id = models.CharField(
        max_length=255,
        unique=True
    )

    razorpay_payment_id = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    razorpay_signature = models.CharField(
        max_length=500,
        blank=True,
        null=True
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.razorpay_order_id