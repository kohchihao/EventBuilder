from rest_framework import serializers
from gql.models.service_type import ServiceType


class FilteredServiceTypeSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        request = self.context.get('request', None)
        if request is None or (not request.user.is_authenticated or not request.user.is_admin()):
            data = data.filter(is_active=True)
        return super(FilteredServiceTypeSerializer, self).to_representation(data)


class ServiceTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        list_serializer_class = FilteredServiceTypeSerializer
        fields = ('id', 'name', 'allow_multiple_selection', 'is_active')


class ServiceTypeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceType
        list_serializer_class = FilteredServiceTypeSerializer
        fields = ('id', 'name', 'services', 'allow_multiple_selection', 'is_active')

