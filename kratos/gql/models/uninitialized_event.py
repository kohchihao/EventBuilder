from django.db import models
from .event_type import EventType
from .service import Service
from decimal import Decimal


class UninitializedEvent(models.Model):
    username = models.CharField(null=False, unique=True, max_length=255)
    name = models.CharField(max_length=255)
    type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    curated_event = models.ForeignKey("CuratedEvent", on_delete=models.PROTECT)
    duration = models.DurationField()
    date = models.DateTimeField()
    attendees = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class UninitializedAgreement(models.Model):
    service = models.ForeignKey(Service, related_name="uninitialized_agreements", on_delete=models.CASCADE)
    event = models.ForeignKey(UninitializedEvent, related_name="uninitialized_agreements", on_delete=models.CASCADE)
    note = models.CharField(max_length=255, blank=True)
    amount = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=19, decimal_places=2)

    @classmethod
    def create(cls, service, event, amount, **kwargs):
        price = service.cost * amount
        price *= 1 + Decimal(service.markup / 100)
        price *= 1 + Decimal(service.tax / 100)
        return cls(service=service, event=event, amount=amount, price=price, **kwargs)

    def __str__(self):
        return "{}.{} ({})".format(self.event.id, self.service.name, self.amount)
