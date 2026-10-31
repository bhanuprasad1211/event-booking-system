from rest_framework.throttling import UserRateThrottle

class BookingThrottle(UserRateThrottle):
    rate = '20/min'