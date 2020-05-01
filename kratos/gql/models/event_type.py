from django.db import models
from .service_type import ServiceType
from .country import Country


class EventType(models.Model):
    name = models.CharField(max_length=255)
    service_types = models.ManyToManyField(ServiceType)
    countries = models.ManyToManyField(Country)
    image_url = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.name
