from django.db import models
from .service import Service
from .curated_event import CuratedEvent
from decimal import Decimal


class CuratedAgreement(models.Model):
    service = models.ForeignKey(Service, related_name='curated_agreements', on_delete=models.CASCADE)
    curated_event = models.ForeignKey(CuratedEvent, related_name='curated_agreements', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()

    def price(self):
        price = self.service.cost * self.quantity
        price *= 1 + Decimal(self.service.markup / 100)
        price *= 1 + Decimal(self.service.tax / 100)
        return round(price, 2)
