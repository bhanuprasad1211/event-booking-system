import razorpay

from django.conf import settings

from django.conf import settings

print("RAZORPAY KEY:", settings.RAZORPAY_KEY_ID)
print("RAZORPAY SECRET:", settings.RAZORPAY_KEY_SECRET)

client = razorpay.Client(
    auth=(
        settings.RAZORPAY_KEY_ID,
        settings.RAZORPAY_KEY_SECRET
    )
)