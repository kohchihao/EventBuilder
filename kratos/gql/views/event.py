from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from gql.serializers.event import EditBasicEventSerializer, EventUpdateSerializer

from gql.permissions import IsAdminOnly
from gql.serializers.event import EventSerializer, EventCreateSerializer, EventAdminSerializer
from gql.models.event import Event
from rest_framework.response import Response
from gql.overrides.permissions import MixedPermissionModelViewSet
from rest_framework.permissions import IsAuthenticated
from io import BytesIO
from django.http import HttpResponse
from gql.utils.google_cloud import download_quotation, upload_quotation
from gql.permissions import IsOwnerOrAdmin
from gql.utils.random import pk_gen
from rest_framework.parsers import MultiPartParser
from django.shortcuts import get_object_or_404
from gql.utils import mail


class EventViewSet(MixedPermissionModelViewSet):
    queryset = []
    permission_classes_by_action = {
        'list': [IsAuthenticated],
        'retrieve': [IsAuthenticated],
        'create': [IsAuthenticated]
    }

    def list(self, request):
        queryset = Event.objects.filter(owner=request.user).all()
        serializer = EventSerializer(queryset, many=True)
        return Response(serializer.data)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([IsAdminOnly])
    def list_with_status(request, status):
        queryset = Event.objects.filter(status=status, owner__isnull=False).all()
        serializer = EventAdminSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        event = get_object_or_404(Event, pk=pk)
        if event.owner != request.user and not request.user.is_admin():
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        return Response(EventAdminSerializer(event).data)

    def create(self, request):
        request.data.update({"owner": request.user.id})
        data = EventCreateSerializer(data=request.data)
        if not data.is_valid():
            return Response(data.errors, status=status.HTTP_400_BAD_REQUEST)
        event = data.save(owner=request.user)
        mail.send_event_pending_notification(event.owner.email, event)
        return Response({"id": event.id})

    @staticmethod
    @api_view(['POST'])
    @permission_classes([IsAuthenticated])
    def update(request):
        parent = get_object_or_404(Event, pk=request.data["parent"])
        if parent.owner is None:
            return Response("Already updated", status=status.HTTP_400_BAD_REQUEST)
        if not request.user.is_admin() and request.user != parent.owner:
            return Response(status=status.HTTP_403_FORBIDDEN)
        if parent.status == Event.ACCEPTED or parent.status == Event.QUOTED or parent.status == Event.CANCELLED:
            return Response("You can't update an event that is ACCEPTED/QUOTED/CANCELLED.",
                            status=status.HTTP_400_BAD_REQUEST)

        owner = parent.owner if request.user.is_admin() else request.user
        request.data.update({"owner": owner.id, "status": Event.PENDING})
        data = EventUpdateSerializer(data=request.data)
        if not data.is_valid():
            return Response(data.errors, status=status.HTTP_400_BAD_REQUEST)
        event = data.save(owner=owner)
        mail.send_event_pending_notification(event.owner.email, event)
        return Response({"id": event.id})

    def get_serializer_class(self):
        return EventSerializer

    @staticmethod
    @api_view(['GET', 'POST'])
    @permission_classes([IsAdminOnly])
    def contact(request, event_id):
        e = Event.objects.get(pk=event_id)
        e.status = Event.CONTACTED
        e.save()
        return Response()

    @staticmethod
    @api_view(['GET', 'POST'])
    @permission_classes([IsAdminOnly])
    def quote(request, event_id):
        e = Event.objects.get(pk=event_id)
        e.status = Event.QUOTED
        e.save()
        mail.send_event_quoted_notification(e.owner.email, e)
        return Response()


    @staticmethod
    @api_view(['GET', 'POST'])
    @permission_classes([IsAuthenticated])
    def accept(request, event_id):
        e = Event.objects.get(pk=event_id)
        if e.owner != request.user and not request.user.is_admin():
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if e.status != Event.QUOTED:
            return Response(status=status.HTTP_403_FORBIDDEN)
        e.status = Event.ACCEPTED
        e.save()
        mail.send_event_accepted_notification(e.owner.email, e)
        return Response()

    @staticmethod
    @api_view(['GET', 'POST'])
    @permission_classes([IsAuthenticated])
    def cancel(request, event_id):
        e = Event.objects.get(pk=event_id)
        if e.owner != request.user and not request.user.is_admin():
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if e.status != Event.QUOTED:
            return Response(status=status.HTTP_403_FORBIDDEN)
        e.status = Event.CANCELLED
        e.save()
        mail.send_event_cancelled_notification(e.owner.email, e)
        return Response()

    @staticmethod
    @api_view(['GET', 'POST'])
    @permission_classes([IsAuthenticated])
    def edit_basic_info(request, event_id):
        e = Event.objects.get(pk=event_id)
        if e.owner != request.user and not request.user.is_admin():
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        return MixedPermissionModelViewSet.update_with_two_serializers(request, event_id, Event,
                                                                       EditBasicEventSerializer, EventAdminSerializer)

    @staticmethod
    @api_view(['GET'])
    @permission_classes([IsOwnerOrAdmin])
    def download_quotation(request, event_id):
        e = get_object_or_404(Event, pk=event_id)
        if e.owner != request.user and not request.user.is_admin():
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        is_signed_param = request.query_params.get('signed', 1)
        if is_signed_param.isdigit() and bool(int(is_signed_param)):
            is_signed = bool(int(is_signed_param))
        else:
            is_signed = False

        output = BytesIO()
        file_to_download = e.signed_quotation_token if is_signed else e.quotation_token
        download_quotation(file_to_download, output)
        return HttpResponse(output.getvalue(), content_type='application/pdf')

    @staticmethod
    @api_view(['POST'])
    @permission_classes([IsOwnerOrAdmin])
    @parser_classes([MultiPartParser])
    def upload_quotation(request, event_id):
        e = get_object_or_404(Event, pk=event_id)
        if e.owner != request.user and not request.user.is_admin():
            return Response(status=status.HTTP_401_UNAUTHORIZED)

        is_signed_param = request.query_params.get('signed', 1)
        if is_signed_param.isdigit() and bool(int(is_signed_param)):
            is_signed = bool(int(is_signed_param))
        else:
            is_signed = False

        data = request.data
        if 'file' in data:
            file = data['file']
            file_token = pk_gen()
            upload_quotation(file, filename=file_token)
            if is_signed:
                e.signed_quotation_token = file_token
            else:
                e.quotation_token = file_token
            e.save()
            return Response(EventAdminSerializer(e).data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
