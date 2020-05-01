from rest_framework import serializers
from gql.models.service import Service, ServiceImage
from gql.serializers.service_type import ServiceTypeSerializer
from gql.serializers.country import CountrySerializer
from gql.utils.serializer import create_model_with_nesting, update_model_with_nesting


class ServiceImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceImage
        fields = ('id', 'url')


class ServiceCreateSerializer(serializers.ModelSerializer):
    images = ServiceImageSerializer(many=True)

    class Meta:
        model = Service
        fields = ('id', 'type', 'provider', 'country_code', 'images', 'name', 'description', 'unit', 'cost',
                  'min_quantity', 'max_quantity', 'markup', 'tax')

    def create(self, validated_data):
        return create_model_with_nesting(validated_data, Service, "service", ['images'], [ServiceImage])


class ServiceUpdateSerializer(serializers.ModelSerializer):
    images = ServiceImageSerializer(many=True)

    class Meta:
        model = Service
        fields = ('id', 'type', 'country_code', 'name', 'description', 'unit', 'markup', 'cost', 'min_quantity',
                  'max_quantity', 'tax', 'images')

    def update(self, instance, validated_data):
        return update_model_with_nesting(instance, validated_data, "service", ['images'], [ServiceImage])


class ServiceReadOnlySerializer(serializers.ModelSerializer):
    from gql.serializers.provider import ProviderSerializer

    type = ServiceTypeSerializer(read_only=True)
    country = CountrySerializer(read_only=True, source='country_code')
    provider = ProviderSerializer(read_only=True)
    images = ServiceImageSerializer(many=True, read_only=True)

    class Meta:
        model = Service
        fields = ('id', 'type', 'provider', 'country', 'name', 'description', 'unit', 'markup', 'tax', 'cost',
                  'min_quantity', 'max_quantity', 'images')


class ServiceLimitedDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'name')
