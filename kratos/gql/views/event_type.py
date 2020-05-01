from gql.models.event_type import EventType
from gql.overrides.permissions import MixedPermissionModelViewSet
from rest_framework.permissions import AllowAny, IsAuthenticated
from gql.permissions import IsAdminOnly
from gql.serializers.event_type import EventTypeWritableSerializer, EventTypeReadOnlySerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from gql.models.country import Country
from gql.serializers.country import CountrySerializer
from gql.models.service_type import ServiceType
from gql.serializers.service_type import ServiceTypeListSerializer
from gql.models.event import Event
from gql.serializers.event import EventSerializer


class EventTypeViewSet(MixedPermissionModelViewSet):
    queryset = EventType.objects.all()
    serializer_class = EventTypeReadOnlySerializer
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
        return super().create_with_two_serializers(request, EventTypeWritableSerializer, EventTypeReadOnlySerializer)

    def update(self, request, *args, **kwargs):
        return super().update_with_two_serializers(request, kwargs['pk'], EventType, EventTypeWritableSerializer,
                                                   EventTypeReadOnlySerializer)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def list_by_country(request, country_code):
        queryset = EventType.objects.filter(countries__code=country_code).all()
        serializer = EventTypeReadOnlySerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def list_event_type_countries(request, event_type_id):
        queryset = Country.objects.filter(eventtype__id=event_type_id)
        serializer = CountrySerializer(queryset, many=True)
        return Response(serializer.data)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def list_event_type_service_types(request, event_type_id):
        if request.user.is_authenticated and request.user.is_admin():
            queryset = ServiceType.objects.filter(eventtype__id=event_type_id)
        else:
            queryset = ServiceType.objects.filter(eventtype__id=event_type_id, is_active=True)
        serializer = ServiceTypeListSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([IsAuthenticated])
    def list_event_type_events(request, event_type_id):
        if request.user.is_authenticated and request.user.is_admin():
            queryset = Event.objects.filter(type_id=event_type_id)
        else:
            queryset = Event.objects.filter(type_id=event_type_id, owner=request.user.id)
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

    def get_serializer_class(self):
        if self.action == 'create' or self.action == 'update':
            return EventTypeWritableSerializer
        return EventTypeReadOnlySerializer
