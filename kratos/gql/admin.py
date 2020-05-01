from django.contrib import admin

from .models.agreement import Agreement
from .models.country import Country
from .models.event import Event
from .models.event_type import EventType
from .models.service import Service
from .models.service_type import ServiceType
from django.contrib.auth.admin import UserAdmin
from gql.models.user import User
from gql.models.curated_agreement import CuratedAgreement
from gql.models.curated_event import CuratedEvent
from gql.models.provider import Provider
from gql.models.uninitialized_event import UninitializedEvent, UninitializedAgreement

admin.site.register(User, UserAdmin)
admin.site.register(Agreement)
admin.site.register(Country)
admin.site.register(Event)
admin.site.register(EventType)
admin.site.register(Service)
admin.site.register(ServiceType)
admin.site.register(CuratedAgreement)
admin.site.register(CuratedEvent)
admin.site.register(Provider)
admin.site.register(UninitializedEvent)
admin.site.register(UninitializedAgreement)
