from rest_framework import generics, permissions
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .serializers import (
    CustomTokenObtainPairSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

from rest_framework.views import APIView
from rest_framework.response import Response

class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

class CustomLoginView(
    TokenObtainPairView
):

    serializer_class =CustomTokenObtainPairSerializer