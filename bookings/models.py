from django.db import models
from django.db import models
from django.conf import settings
from events.models import Event
import uuid
from django.core.files import File
from io import BytesIO
import qrcode
from django.core import signing

from django.utils import timezone
from datetime import timedelta

User = settings.AUTH_USER_MODEL
# Create your models here.

class Booking(models.Model):
    STATUS_CHOICES = (
    ('PENDING', 'Pending'),
    ('CONFIRMED', 'Confirmed'),
    ('CANCELLED', 'Cancelled'),
    ('FAILED', 'Failed'),
)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='bookings')

    ticket_count = models.PositiveIntegerField()

    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    booked_at = models.DateTimeField(auto_now_add=True)

    expires_at = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-booked_at']

    def __str__(self):
        return f"{self.user} - {self.event}"
    
class Ticket(models.Model):
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='tickets'
    )

    ticket_uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True
    )

    qr_code = models.ImageField(upload_to='qr_codes/', blank=True)

    is_checked_in = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def generate_qr_code(self):
        #print(f"Generating QR for ticket {self.ticket_uuid}")  # Debug
        
        # qr_data = f"""
        # ticket_uuid:{self.ticket_uuid}
        # booking_id:{self.booking.id}
        # event:{self.booking.event.title}
        # user:{self.booking.user.username}
        # """
        
        #print(f"QR Data: {qr_data}")  # Debug
        
        #qr = qrcode.make(qr_data)
        payload = {
            "ticket_uuid": str(self.ticket_uuid),
            "booking_id": self.booking.id,
        }

        signed_data = signing.dumps(payload)

        qr = qrcode.make(signed_data)
        
        buffer = BytesIO()
        qr.save(buffer, format='PNG')
        
        file_name = f"ticket_{self.ticket_uuid}.png"
        
        self.qr_code.save(
            file_name,
            File(buffer),
            save=False
        )
        #print(f"QR saved as {file_name}")  # Debug

    def save(self, *args, **kwargs):

        is_new = self.pk is None

        super().save(*args, **kwargs)

        if is_new and not self.qr_code:
            self.generate_qr_code()
            super().save(update_fields=['qr_code'])

    def __str__(self):
        return str(self.ticket_uuid)