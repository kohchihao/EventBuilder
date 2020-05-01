from rest_framework import serializers
from gql.models.curated_event import CuratedEvent, CuratedEventImage
from gql.models.curated_agreement import CuratedAgreement
from gql.serializers.event_type import EventTypeSerializer
from gql.serializers.country import CountrySerializer
from gql.serializers.curated_agreement import CuratedAgreementReadOnlySerializer, CuratedAgreementSerializer, \
    CuratedAgreementUpdateSerializer
from gql.utils.serializer import create_model_with_nesting, update_model_with_nesting


class CuratedEventImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuratedEventImage
        fields = ('id', 'url')


class CuratedEventReadOnlySerializer(serializers.ModelSerializer):
    curated_agreements = CuratedAgreementReadOnlySerializer(many=True, read_only=True)
    type = EventTypeSerializer(read_only=True)
    country = CountrySerializer(read_only=True)
    images = CuratedEventImageSerializer(many=True, read_only=True)

    class Meta:
        model = CuratedEvent
        fields = ('id', 'name', 'country', 'type', 'visibility', 'is_past_event', 'description', 'price', 'pax',
                  'duration', 'curated_agreements', 'images')


class CuratedCreateEventSerializer(serializers.ModelSerializer):
    curated_agreements = CuratedAgreementSerializer(many=True)
    images = CuratedEventImageSerializer(many=True)

    class Meta:
        model = CuratedEvent
        fields = ('id', 'name', 'country', 'type', 'visibility', 'is_past_event', 'description', 'price', 'pax',
                  'duration', 'curated_agreements', 'images')

    def create(self, validated_data):
        return create_model_with_nesting(validated_data, CuratedEvent, 'curated_event',
                                         ['curated_agreements', 'images'], [CuratedAgreement, CuratedEventImage],
                                         [Utils.validate_agreement, None])


class CuratedEventUpdateSerializer(serializers.ModelSerializer):
    curated_agreements = CuratedAgreementUpdateSerializer(many=True)
    images = CuratedEventImageSerializer(many=True)

    class Meta:
        model = CuratedEvent
        fields = ('id', 'name', 'country', 'type', 'visibility', 'description', 'price', 'pax', 'duration',
                  'curated_agreements', 'images')

    def update(self, instance, validated_data):
        return update_model_with_nesting(instance, validated_data, 'curated_event', ['curated_agreements', 'images'],
                                         [CuratedAgreement, CuratedEventImage], [Utils.validate_agreement, None])


class Utils:
    @staticmethod
    def validate_agreement(agreement):
        service = agreement.service
        quantity = agreement.quantity
        if service.min_quantity > quantity:
            raise serializers.ValidationError('The min capacity of ' + str(service.min_quantity) + ' is not met')
        elif service.max_quantity and service.max_quantity < quantity:
            raise serializers.ValidationError(service.name + ': reached its max capacity of ' + str(service.max_quantity))
        else:
            return agreement.service.cost * quantity
