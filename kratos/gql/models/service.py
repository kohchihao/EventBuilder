from django.db import models

from .provider import Provider
from .service_type import ServiceType
from .country import Country


class Service(models.Model):
    type = models.ForeignKey(ServiceType, related_name="services", on_delete=models.CASCADE)
    country_code = models.ForeignKey(Country, on_delete=models.CASCADE)
    provider = models.ForeignKey(Provider, related_name="services", on_delete=models.PROTECT)

    name = models.CharField(max_length=255)
    description = models.CharField(max_length=1000, blank=True)
    unit = models.CharField(max_length=255)
    min_quantity = models.PositiveIntegerField()
    max_quantity = models.PositiveIntegerField(null=True, blank=True)

    cost = models.DecimalField(max_digits=19, decimal_places=2)
    markup = models.FloatField()
    tax = models.FloatField()

    def __str__(self):
        return "{}: {}".format(self.name, self.country_code)


class ServiceImage(models.Model):
    url = models.URLField(null=True, blank=True)
    service = models.ForeignKey(Service, related_name="images", on_delete=models.CASCADE)
