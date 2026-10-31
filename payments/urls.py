from django.urls import path

from .views import (
    CreatePaymentOrderView,
    PaymentFailureView,
    VerifyPaymentView,
    payment_test_page
)

urlpatterns = [
    path(
        'create-order/',
        CreatePaymentOrderView.as_view()
    ),

    path(
        'verify/',
        VerifyPaymentView.as_view()
    ),
    path(
    'failure/',
    PaymentFailureView.as_view()
    ),
    path(
    'test-page/',
    payment_test_page
),
]