from django.db import models

from .event_type import EventType
from .service import Service
from .country import Country


class CuratedEvent(models.Model):
    name = models.CharField(max_length=255)
    type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    country = models.ForeignKey(Country, on_delete=models.CASCADE)
    services = models.ManyToManyField(Service, through='gql.CuratedAgreement', related_name='curated_events')
    visibility = models.BooleanField(default=True)
    description = models.CharField(max_length=1000, blank=True)
    is_past_event = models.BooleanField(default=False)

    price = models.DecimalField(max_digits=19, decimal_places=2)
    pax = models.PositiveIntegerField()
    duration = models.DurationField()


class CuratedEventImage(models.Model):
    url = models.URLField(null=True, blank=True)
    curated_event = models.ForeignKey(CuratedEvent, related_name="images", on_delete=models.CASCADE)
