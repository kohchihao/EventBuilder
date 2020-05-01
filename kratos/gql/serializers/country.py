from rest_framework import serializers
from gql.models.country import Country


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('code', 'name')
