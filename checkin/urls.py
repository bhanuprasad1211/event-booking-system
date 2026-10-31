from django.urls import path
from .views import VerifyTicketView, CheckInTicketView,VerifySignedQRCodeView

urlpatterns = [
    path('verify/<uuid:ticket_uuid>/', VerifyTicketView.as_view()),
    path('checkin/<uuid:ticket_uuid>/', CheckInTicketView.as_view()),
    path('verify-signed/',VerifySignedQRCodeView.as_view()),
]