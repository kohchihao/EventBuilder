from gql.overrides.permissions import MixedPermissionViewSet
from rest_framework.response import Response
from gql.serializers.auth import UserLoginSerializer, RegisterSerializer
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from gql.utils.auth_token import token_expire_handler
from gql.serializers.user import UserSerializer
from firebase_admin import auth, exceptions
from rest_framework.decorators import api_view, permission_classes
from django.conf import settings
from gql.serializers.event import UninitializedEventSerializer
from gql.models.uninitialized_event import UninitializedEvent
from gql.models.event import Event
from gql.models.agreement import Agreement
from gql.overrides.auth import FirebaseAuthBackend
from gql.utils import mail


class AuthViewSet(MixedPermissionViewSet):
    permission_classes_by_action = {'create': [AllowAny], 'list': [AllowAny]}

    # Login
    def create(self, request):
        login_serializer = UserLoginSerializer(data=request.data)
        login_serializer.is_valid(raise_exception=True)

        user = authenticate(request)
        if not user:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)
        token, created = Token.objects.get_or_create(user=user)
        is_expired, token = token_expire_handler(token)
        role, country, ip = user.get_user_info(request)
        need_more_info = not bool(user.name)
        event = self.check_for_uninitialized_event(user)
        response = self.create_response(UserSerializer(user).data, role, country, ip, token, event, need_more_info)
        response.set_cookie(settings.TOKEN_COOKIE_NAME, token.key, max_age=settings.TOKEN_EXPIRED_AFTER_SECONDS,
                            httponly=True)
        return response

    # Silent login
    def list(self, request, pk=None):
        cookie_token = request.COOKIES.get(settings.TOKEN_COOKIE_NAME)
        token = Token.objects.filter(key=cookie_token).first()
        if token:
            user = token.user
            firebase_user = auth.get_user(user.username)
            FirebaseAuthBackend.update_user_if_outdated(firebase_user, user)
            role, country, ip = user.get_user_info(request)
            event = self.check_for_uninitialized_event(user)
            return self.create_response(UserSerializer(user).data, role, country, ip, token, event)
        else:
            return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

    # Logout
    def delete(self, request, pk=None):
        request.user.auth_token.delete()
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie(settings.TOKEN_COOKIE_NAME)
        return response

    # Register
    @staticmethod
    @api_view(['POST'])
    @permission_classes([AllowAny])
    def register(request):
        register_serializer = RegisterSerializer(data=request.data)
        register_serializer.is_valid(raise_exception=True)
        data = register_serializer.data

        action_code_settings = auth.ActionCodeSettings(
            url='https://buildevents.today/#login',
        )
        try:
            user = auth.create_user(email=data['email'], phone_number=data['phone_number'], display_name=data['name'],
                                    password=data['password'])
            link = auth.generate_email_verification_link(user.email, action_code_settings)
            email_success = AuthViewSet.send_verification_email(user.email, link)
            if not email_success:
                return Response({'detail': 'Something went wrong, we are unable to send a verification link to your '
                                           'email'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            else:
                return Response("Verification link has been sent to {}.".format(user.email),
                                status=status.HTTP_200_OK)
        except (ValueError, exceptions.FirebaseError) as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    # Register with event details
    @staticmethod
    @api_view(['POST'])
    @permission_classes([AllowAny])
    def register_with_event_details(request):
        register_serializer = RegisterSerializer(data=request.data)
        event_serializer = UninitializedEventSerializer(data=request.data)
        register_serializer.is_valid(raise_exception=True)
        event_serializer.is_valid(raise_exception=True)
        data = register_serializer.data

        action_code_settings = auth.ActionCodeSettings(
            url='https://buildevents.today/#login',
        )
        try:
            user = auth.create_user(email=data['email'], phone_number=data['phone_number'], display_name=data['name'],
                                    password=data['password'])
            event_serializer.save(username=user.uid)
            link = auth.generate_email_verification_link(user.email, action_code_settings)
            email_success = AuthViewSet.send_verification_email(user.email, link)
            if not email_success:
                return Response({'detail': 'Something went wrong, we are unable to send a verification link to your '
                                           'email'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
            else:
                return Response("Verification link has been sent to {}.".format(user.email),
                                status=status.HTTP_200_OK)
        except (ValueError, exceptions.FirebaseError) as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def create_response(self, user, role, country, ip, token, event, need_info=False):
        event_id = event.id if event else None
        return Response({settings.TOKEN_COOKIE_NAME: token.key, 'user': user, "role": role,
                         "country": country, "ip": ip, "event": event_id, "need_info": need_info},
                        status=status.HTTP_200_OK)

    # Check whether user has any uninitialized event
    def check_for_uninitialized_event(self, user):
        uninitialized_event = UninitializedEvent.objects.filter(username=user.username).first()
        if uninitialized_event is not None:
            event = Event.create_from_uninitialized_event(uninitialized_event, user)
            uninit_agreements = uninitialized_event.uninitialized_agreements.all()
            Agreement.objects.bulk_create([Agreement.create(curated_event=event.curated_event, event=event,
                                                            service=agreement.service,
                                                            amount=agreement.amount)
                                           for agreement in uninit_agreements])
            uninitialized_event.delete()
            mail.send_event_pending_notification(user.email, event)
            return event
        return None

    @staticmethod
    def send_verification_email(email, verification_link):
        return mail.send_verification(email, verification_link)

