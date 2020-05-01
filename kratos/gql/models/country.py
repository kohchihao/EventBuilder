from django.db import models
from django.core.validators import RegexValidator


class Country(models.Model):
    class Meta:
        verbose_name_plural = "countries"

    code = models.CharField(max_length=2, validators=[RegexValidator(regex='^.{2}$', message='Length has to be 2')],
                            unique=True, primary_key=True)
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name
