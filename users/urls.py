from django.urls import path
from .views import CustomLoginView, RegisterView, MeView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', CustomLoginView.as_view()),
    path('refresh/', TokenRefreshView.as_view()),
    path('me/', MeView.as_view()),
]