from rest_framework import serializers


class UserLoginSerializer(serializers.Serializer):
    token = serializers.CharField(required=True)


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField(max_length=255)
    phone_number = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=128)
