from gql.overrides.permissions import MixedPermissionModelViewSet
from rest_framework.permissions import AllowAny
from gql.permissions import IsAdminOnly
from gql.models.provider import Provider
from gql.serializers.provider import ProviderReadOnlySerializer, ProviderWritableSerializer


class ProviderViewSet(MixedPermissionModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderReadOnlySerializer
    http_method_names = ['get', 'put', 'post']
    permission_classes_by_action = {
        'list': [AllowAny],
        'retrieve': [AllowAny],
        'create': [IsAdminOnly],
        'update': [IsAdminOnly],
        'partial_update': [IsAdminOnly],
        'destroy': [IsAdminOnly]
    }

    def create(self, request, *args, **kwargs):
        return super().create_with_two_serializers(request, ProviderWritableSerializer, ProviderReadOnlySerializer)

    def update(self, request, *args, **kwargs):
        print(kwargs)
        return super().update_with_two_serializers(request, kwargs['pk'], Provider, ProviderWritableSerializer,
                                                   ProviderReadOnlySerializer)

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return ProviderReadOnlySerializer
        elif self.action == 'create' or self.action == 'update':
            return ProviderWritableSerializer
        else:
            return ProviderReadOnlySerializer
