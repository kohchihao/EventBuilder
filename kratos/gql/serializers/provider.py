from rest_framework import serializers
from gql.models.service import Service
from gql.models.provider import Provider


class ServiceLimitedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'name')


class ProviderWritableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ('id', 'name', 'email')


class ProviderReadOnlySerializer(serializers.ModelSerializer):
    services = ServiceLimitedDataSerializer(many=True, read_only=True)

    class Meta:
        model = Provider
        fields = ('id', 'name', 'email', 'services')


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ('id', 'name', 'email')
