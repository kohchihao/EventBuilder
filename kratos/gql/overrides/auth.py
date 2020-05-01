from django.contrib.auth.backends import ModelBackend
from gql.models.user import User
from firebase_admin import auth
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from rest_framework.exceptions import AuthenticationFailed
from gql.utils.auth_token import token_expire_handler
from django.conf import settings
from gql.models.country import Country


class FirebaseAuthBackend(ModelBackend):
    """ Verify user's attempt to login with firebase """
    def verify_user(self, token):
        try:
            return auth.verify_id_token(token)
        except (ValueError, auth.InvalidIdTokenError, auth.ExpiredIdTokenError,
                auth.RevokedIdTokenError, auth.CertificateFetchError):
            return None

    """
    Log in to Django without providing a password since user is already authenticated with firebase.
    """
    def authenticate(self,  request, username=None, password=None, **kwargs):
        if password is None:
            token = request.data['token']
            firebase_user = self.verify_user(token)
            if firebase_user and firebase_user['email_verified']:
                try:
                    firebase_user = auth.get_user(firebase_user['uid'])
                    user = User.objects.get(username=firebase_user.uid)
                    user = self.update_user_if_outdated(firebase_user, user)
                    return user
                except User.DoesNotExist:
                    return self.create_user(firebase_user)
            else:
                return None
        else:
            return ModelBackend.authenticate(self, request, username, password)

    def create_user(self, firebase_user):
        name = firebase_user.display_name if firebase_user.display_name else ''
        number = firebase_user.phone_number if firebase_user.phone_number else '0'
        user = User.objects.create_user(username=firebase_user.uid, email=firebase_user.email,
                                        name=name, phone_number=number)
        user.save()
        country = Country.objects.filter(code=settings.DEFAULT_COUNTRY).first()
        if not country:
            country = Country.objects.create(code=settings.DEFAULT_COUNTRY, name=settings.DEFAULT_COUNTRY_NAME)
            country.save()

        user.countries.add(country)
        return user

    # Will sync the information between firebase and backend, based on firebase's uid.
    @staticmethod
    def update_user_if_outdated(firebase_user, user):
        if user.email != firebase_user.email:
            user.email = firebase_user.email
        if firebase_user.phone_number and user.phone_number != firebase_user.phone_number:
            user.phone_number = firebase_user.phone_number
        if firebase_user.display_name and user.name != firebase_user.display_name:
            user.name = firebase_user.display_name
        user.save()
        return user


class ExpiringTokenAuthentication(TokenAuthentication):
    """
    If token is expired then it will be removed
    and new one with different key will be created
    """

    def authenticate_credentials(self, key):
        try:
            token = Token.objects.get(key=key)
        except Token.DoesNotExist:
            raise AuthenticationFailed("Unauthorized")

        if not token.user.is_active:
            raise AuthenticationFailed("User is not active. Please contact admin to retrieve your account.")

        is_expired, token = token_expire_handler(token=token)
        if is_expired:
            raise AuthenticationFailed("Unauthorized")

        return token.user, token

