from django.db import models


class ServiceType(models.Model):
    name = models.CharField(max_length=255)
    allow_multiple_selection = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
