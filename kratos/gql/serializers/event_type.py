from rest_framework import serializers
from gql.models.event_type import EventType
from gql.models.country import Country
from gql.models.service_type import ServiceType
from gql.serializers.service_type import ServiceTypeSerializer
from gql.serializers.country import CountrySerializer


class EventTypeWritableSerializer(serializers.ModelSerializer):
    countries = serializers.PrimaryKeyRelatedField(many=True, queryset=Country.objects.all())
    service_types = serializers.PrimaryKeyRelatedField(many=True, queryset=ServiceType.objects.all())

    class Meta:
        model = EventType
        fields = ('id', 'name', 'service_types', 'countries', 'image_url')


class EventTypeReadOnlySerializer(serializers.ModelSerializer):
    countries = CountrySerializer(many=True, read_only=True)
    service_types = ServiceTypeSerializer(many=True, read_only=True)

    class Meta:
        model = EventType
        fields = ('id', 'name', 'image_url', 'service_types', 'countries')


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ('id', 'name')
