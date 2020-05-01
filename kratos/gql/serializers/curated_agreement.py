from rest_framework import serializers
from gql.models.curated_agreement import CuratedAgreement
from gql.serializers.service import ServiceLimitedDataSerializer


class CuratedAgreementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuratedAgreement
        fields = ('id', 'quantity', 'service')


class CuratedAgreementUpdateSerializer(serializers.ModelSerializer):
    id = serializers.ModelField(model_field=CuratedAgreement()._meta.get_field('id'), required=False)

    class Meta:
        model = CuratedAgreement
        fields = ('id', 'quantity', 'service')


class FilteredAgreementSerializer(serializers.ListSerializer):
    def to_representation(self, data):
        request = self.context.get('request', None)
        if request is None or (not request.user.is_authenticated or not request.user.is_admin()):
            data = data.filter(service__type__is_active=True)
        return super(FilteredAgreementSerializer, self).to_representation(data)


class CuratedAgreementReadOnlySerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()
    service = ServiceLimitedDataSerializer(read_only=True)

    class Meta:
        model = CuratedAgreement
        list_serializer_class = FilteredAgreementSerializer
        fields = ('id', 'quantity', 'service', 'price')

    def get_price(self, agreement):
        return agreement.price()
