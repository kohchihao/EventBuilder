from gql.overrides.permissions import MixedPermissionModelViewSet
from rest_framework.permissions import AllowAny
from gql.permissions import IsAdminOnly
from gql.models.service import Service
from gql.serializers.service import ServiceCreateSerializer, ServiceReadOnlySerializer, ServiceUpdateSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


class ServiceViewSet(MixedPermissionModelViewSet):
    queryset = Service.objects.all()
    http_method_names = ('get', 'put', 'post')
    permission_classes_by_action = {
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'create': [IsAdminOnly],
        'update': [IsAdminOnly],
        'partial_update': [IsAdminOnly],
        'destroy': [IsAdminOnly]
    }

    def create(self, request, *args, **kwargs):
        return super().create_with_two_serializers(request, ServiceCreateSerializer, ServiceReadOnlySerializer)

    def update(self, request, *args, **kwargs):
        return super().update_with_two_serializers(request, kwargs['pk'], Service, ServiceUpdateSerializer,
                                                   ServiceReadOnlySerializer)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def list_services_by_country(request, country_code):
        queryset = Service.objects.filter(country_code=country_code).all()
        serializer = ServiceReadOnlySerializer(queryset, many=True)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == 'create':
            return ServiceCreateSerializer
        elif self.action == 'update':
            return ServiceUpdateSerializer
        return ServiceReadOnlySerializer


