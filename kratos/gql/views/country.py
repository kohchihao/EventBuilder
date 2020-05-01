from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from gql.serializers.country import CountrySerializer
from gql.models.country import Country
from gql.overrides.permissions import MixedPermissionViewSet
from rest_framework.permissions import AllowAny


class CountryViewSet(MixedPermissionViewSet):
    permission_classes_by_action = {
        'list': [AllowAny],
        'retrieve': [AllowAny],
    }

    def list(self, request):
        queryset = Country.objects.all()
        serializer = CountrySerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Country.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = CountrySerializer(user)
        return Response(serializer.data)
