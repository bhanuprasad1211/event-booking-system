from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            role=validated_data.get('role', 'ATTENDEE')
        )
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'role')

class CustomTokenObtainPairSerializer(
    TokenObtainPairSerializer
):

    @classmethod
    def get_token(cls, user):

        token =super().get_token(user)

        token["role"] = user.role

        return token

    def validate(self, attrs):

        data =super().validate(attrs)

        data["user"] = {

            "id":
                self.user.id,

            "username":
                self.user.username,

            "role":
                self.user.role
        }

        return data
