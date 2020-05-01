from django.db import models

from gql.models.user import User
from gql.utils.random import gen_petname
from .event_type import EventType


class Event(models.Model):
    PENDING = "PENDING"
    CONTACTED = "CONTACTED"
    QUOTED = "QUOTED"
    ACCEPTED = "ACCEPTED"
    CANCELLED = "CANCELLED"

    STATUS_CHOICES = [
        (PENDING, PENDING),
        (CONTACTED, CONTACTED),
        (QUOTED, QUOTED),
        (ACCEPTED, ACCEPTED),
        (CANCELLED, CANCELLED),
    ]

    id = models.CharField(max_length=64, primary_key=True, default=gen_petname, verbose_name="ID")
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    owner = models.ForeignKey(User, related_name="events", null=True, on_delete=models.PROTECT)
    type = models.ForeignKey(EventType, on_delete=models.CASCADE)
    status = models.CharField(max_length=255, choices=STATUS_CHOICES, default=PENDING)
    note = models.CharField(max_length=10000, blank=True)
    parent = models.ForeignKey("self", on_delete=models.CASCADE)
    curated_event = models.ForeignKey("CuratedEvent", on_delete=models.PROTECT)
    duration = models.DurationField()
    date = models.DateTimeField()
    attendees = models.PositiveIntegerField()

    quotation_token = models.CharField(null=True, blank=True, unique=True, max_length=255)
    signed_quotation_token = models.CharField(null=True, blank=True, unique=True, max_length=255)

    @classmethod
    def create_from_uninitialized_event(cls, uninitialized_event, owner):
        event = cls(name=uninitialized_event.name, owner=owner, type=uninitialized_event.type, parent_id="genesis",
                    curated_event=uninitialized_event.curated_event, duration=uninitialized_event.duration,
                    date=uninitialized_event.date, attendees=uninitialized_event.attendees)
        event.save()
        return event
