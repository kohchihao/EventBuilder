from gql.serializers.curated_event import CuratedEventReadOnlySerializer, CuratedCreateEventSerializer, \
    CuratedEventUpdateSerializer
from gql.models.curated_event import CuratedEvent
from gql.overrides.permissions import MixedPermissionModelViewSet
from rest_framework.permissions import AllowAny
from gql.permissions import IsAdminOnly
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Func, F, ExpressionWrapper, IntegerField
from django.db.models.functions import ExtractHour


class CuratedEventViewSet(MixedPermissionModelViewSet):
    queryset = CuratedEvent.objects.all()
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
        return super().create_with_two_serializers(request, CuratedCreateEventSerializer,
                                                   CuratedEventReadOnlySerializer)

    def update(self, request, *args, **kwargs):
        return super().update_with_two_serializers(request, kwargs['pk'], CuratedEvent, CuratedEventUpdateSerializer,
                                                   CuratedEventReadOnlySerializer)

    def get_queryset(self):
        queryset = self.get_curated_events(user=self.request.user).all()
        country_code = self.request.query_params.get('country_code', None)
        pax = self.request.query_params.get('pax', None)
        event_type = self.request.query_params.get('event_type', None)
        duration = self.request.query_params.get('duration', None)
        budget = self.request.query_params.get('budget', None)
        is_past_event = self.request.query_params.get('is_past_event', None)

        weight_func = 0
        is_search = False
        if is_past_event is not None:
            if is_past_event.isdigit() and bool(int(is_past_event)):
                queryset = queryset.filter(is_past_event=True)
            elif is_past_event.isdigit() and not bool(int(is_past_event)):
                queryset = queryset.filter(is_past_event=False)
        if country_code is not None:
            queryset = queryset.filter(country__code=country_code)
        if event_type is not None and event_type != '*':
            queryset = queryset.filter(type=event_type)
        if pax is not None and pax != '*':
            weight_func += F('pax') - int(pax)
            is_search = True
        if duration is not None and duration != '*':
            weight_func += ExtractHour(F('duration'), 'epoch') - int(duration)
            is_search = True
        if budget is not None and budget != '*':
            # Scale down the effect of price to match up with pax.
            weight_func += (F('price') - int(budget)) / 100
            is_search = True

        if is_search:
            queryset = queryset.annotate(weight=Func(ExpressionWrapper(weight_func, output_field=IntegerField()),
                                                     function='ABS'))
            queryset = queryset.order_by('weight')
        else:
            queryset = queryset.order_by('-price')
        return queryset

    @staticmethod
    def get_curated_events(user):
        if user.is_authenticated and user.is_admin():
            return CuratedEvent.objects.all()
        else:
            return CuratedEvent.objects.filter(visibility=True)

    def get_serializer_class(self):
        if self.action == 'list' or self.action == 'retrieve':
            return CuratedEventReadOnlySerializer
        elif self.action == 'update':
            return CuratedEventUpdateSerializer
        elif self.action == 'create':
            return CuratedCreateEventSerializer
        return CuratedEventReadOnlySerializer

    @staticmethod
    @api_view(['GET'])
    @permission_classes([AllowAny])
    def list_by_country(request, country_code):
        queryset = CuratedEventViewSet.get_curated_events(request.user).filter(country=country_code).all()
        serializer = CuratedEventReadOnlySerializer(queryset, many=True)
        return Response(serializer.data)
