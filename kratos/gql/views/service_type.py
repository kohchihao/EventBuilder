from gql.models.service_type import ServiceType
from gql.overrides.permissions import MixedPermissionModelViewSet
from rest_framework.permissions import AllowAny
from gql.permissions import IsAdminOnly
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from gql.serializers.service_type import ServiceTypeSerializer, ServiceTypeListSerializer
from gql.models.service import Service
from gql.serializers.service import ServiceReadOnlySerializer
from rest_framework.decorators import api_view, permission_classes


class ServiceTypeViewSet(MixedPermissionModelViewSet):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    http_method_names = ('get', 'patch', 'post')
    permission_classes_by_action = {
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'create': [IsAdminOnly],
        'update': [IsAdminOnly],
        'partial_update': [IsAdminOnly],
        'destroy': [IsAdminOnly]
    }

    def get_queryset(self):
        return self.get_service_types(self.request.user).all()

    @staticmethod
    def get_service_types(user):
        if user.is_authenticated and user.is_admin():
            return ServiceType.objects.all()
        else:
            return ServiceType.objects.filter(is_active=True)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def list_service_type_services(request, service_type_id):
        service_type = get_object_or_404(ServiceType, pk=service_type_id)
        if not service_type.is_active and not (request.user.is_authenticated and request.user.is_admin()):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        queryset = Service.objects.filter(type_id=service_type_id)
        serializer = ServiceReadOnlySerializer(queryset, many=True)
        return Response(serializer.data)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def list_service_type_services_by_country(request, country_code, service_type_id):
        service_type = get_object_or_404(ServiceType, pk=service_type_id)
        if not service_type.is_active and not (request.user.is_authenticated and request.user.is_admin()):
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        queryset = Service.objects.filter(type_id=service_type_id, country_code=country_code)
        serializer = ServiceReadOnlySerializer(queryset, many=True)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == 'list':
            return ServiceTypeListSerializer
        else:
            return ServiceTypeSerializer
