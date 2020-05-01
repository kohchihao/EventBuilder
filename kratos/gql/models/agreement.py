from django.db import models
from .service import Service
from .event import Event
from decimal import Decimal
from gql.models.curated_event import CuratedEvent


class Agreement(models.Model):
    service = models.ForeignKey(Service, related_name="agreements", on_delete=models.CASCADE)
    event = models.ForeignKey(Event, related_name="agreements", on_delete=models.CASCADE)
    note = models.CharField(max_length=255, blank=True)
    amount = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=19, decimal_places=2)

    @classmethod
    def create(cls, service, event, amount, curated_event, **kwargs):
        curated_event = CuratedEvent.objects.get(id=curated_event.id)
        curated_agreement = curated_event.curated_agreements.filter(service_id=service.id).first()

        new_amount = amount
        if curated_agreement is not None:
            new_amount = amount - curated_agreement.quantity

        price = service.cost * new_amount
        price *= 1 + Decimal(service.markup / 100)
        price *= 1 + Decimal(service.tax / 100)
        return cls(service=service, event=event, amount=amount, price=price, **kwargs)

    def __str__(self):
        return "{}.{} ({})".format(self.event.id, self.service.name, self.amount)
