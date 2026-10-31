from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Event(models.Model):
    CATEGORY_CHOICES = (
        ('CONCERT', 'Concert'),
        ('WORKSHOP', 'Workshop'),
        ('SPORTS', 'Sports'),
        ('CONFERENCE', 'Conference'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    location = models.CharField(max_length=255)

    date_time = models.DateTimeField()

    capacity = models.PositiveIntegerField()
    available_tickets = models.PositiveIntegerField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    is_published = models.BooleanField(default=False)
    is_cancelled = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        # Ensure available_tickets is set initially
        if not self.pk:
            self.available_tickets = self.capacity
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title