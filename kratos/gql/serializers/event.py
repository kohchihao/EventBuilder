from rest_framework import serializers
from gql.models import Event, Service, Agreement, User, EventType, CuratedEvent, Country, UninitializedEvent
from gql.models.uninitialized_event import UninitializedAgreement


class AgreementSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all(), source='service')

    class Meta:
        model = Agreement
        fields = ('id', 'amount')

    def validate(self, attr):
        service = attr["service"]
        amount = attr["amount"]
        if service.min_quantity > amount:
            raise serializers.ValidationError(service.name + ': min capacity of ' + str(service.min_quantity) + ' is not met')
        elif service.max_quantity and service.max_quantity < amount:
            raise serializers.ValidationError(service.name + ': has reached its max capacity of ' +
                                              str(service.max_quantity))
        return attr


class EventCreateSerializer(serializers.ModelSerializer):
    services = AgreementSerializer(many=True)

    class Meta:
        model = Event
        fields = ('type', 'name', 'owner', 'parent', 'note', 'date', 'attendees', 'services', 'curated_event', 'duration')

    def create(self, data):
        services = data.pop('services')
        event = Event.objects.create(**data)
        Agreement.objects.bulk_create([Agreement.create(curated_event=data['curated_event'], event=event, **service) for service in services])
        return event


class EventUpdateSerializer(serializers.ModelSerializer):
    services = AgreementSerializer(many=True)

    class Meta:
        model = Event
        fields = ('type', 'name', 'owner', 'parent', 'note', 'date', 'attendees', 'services', 'curated_event', 'duration')

    def create(self, data):
        parent = data["parent"]
        parent.owner = None
        parent.save()

        services = data.pop('services')
        event = Event.objects.create(**data)
        Agreement.objects.bulk_create([Agreement.create(curated_event=data['curated_event'], event=event, **service) for service in services])
        return event


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'phone_number')


class EventTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventType
        fields = ('id', 'name', )


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'name', )


class AgreementReadSerializer(serializers.ModelSerializer):
    service = ServiceSerializer()

    class Meta:
        model = Agreement
        fields = ('id', 'service', 'price', 'amount', 'note')


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ('code', 'name', )


class CuratedEventSerializer(serializers.ModelSerializer):
    country = CountrySerializer()

    class Meta:
        model = CuratedEvent
        fields = ('id', 'name', 'description', 'country')


class EventAdminSerializer(serializers.ModelSerializer):
    owner = UserSerializer()
    type = EventTypeSerializer()
    curated_event = CuratedEventSerializer()
    agreements = AgreementReadSerializer(many=True)
    price = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            'id',
            'name',
            'owner',
            'type',
            'status',
            'note',
            'parent',
            'date',
            'attendees',
            'price',
            'curated_event',
            'duration',
            'agreements',
            'quotation_token',
            'signed_quotation_token'
        )

    def get_price(self, obj):
        agreements = obj.agreements.all()
        return sum(map(lambda x: x.price, agreements))


class EventSerializer(serializers.ModelSerializer):
    services = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = ('id', 'name', 'type', 'parent', 'curated_event', 'date', 'attendees', 'services', 'status', 'note',
                  'quotation_token', 'signed_quotation_token')

    def get_services(self, obj):
        return [{"id": agreement.service.id, "amount": agreement.amount} for agreement in obj.agreements.all()]


class EditBasicEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'name')


class UninitializedAgreementSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all(), source='service')

    class Meta:
        model = UninitializedAgreement
        fields = ('id', 'amount')

    def validate(self, attr):
        service = attr["service"]
        amount = attr["amount"]
        if service.min_quantity > amount:
            raise serializers.ValidationError('The min capacity of ' + str(service.min_quantity) + ' is not met')
        elif service.max_quantity and service.max_quantity < amount:
            raise serializers.ValidationError(service.name + ': has reached its max capacity of ' +
                                              str(service.max_quantity))
        return attr


class UninitializedEventSerializer(serializers.ModelSerializer):
    event_name = serializers.CharField(max_length=255, source='name')
    services = UninitializedAgreementSerializer(many=True)

    class Meta:
        model = UninitializedEvent
        fields = ('event_name', 'type', 'curated_event', 'duration', 'date', 'attendees', 'services')

    def create(self, data):
        services = data.pop('services')
        event = UninitializedEvent.objects.create(**data)
        UninitializedAgreement.objects.bulk_create([UninitializedAgreement.create(event=event, **service) for
                                                    service in services])
        return event
