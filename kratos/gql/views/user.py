from gql.overrides.permissions import MixedPermissionModelViewSet
from gql.permissions import IsAdminOnly
from gql.models.user import User
from gql.permissions import IsOwnerOrAdmin
from gql.serializers.user import UserUpdateSerializer, UserSerializer
from django.shortcuts import get_object_or_404
from firebase_admin import auth, exceptions
from rest_framework.response import Response
from rest_framework import status


class UserViewSet(MixedPermissionModelViewSet):
    queryset = User.objects.all()
    http_method_names = ('get', 'patch')
    permission_classes_by_action = {
        'list': [IsAdminOnly],
        'retrieve': [IsOwnerOrAdmin],
        'create': [IsAdminOnly],
        'update': [IsOwnerOrAdmin],
        'partial_update': [IsOwnerOrAdmin],
        'destroy': [IsAdminOnly]
    }

    def partial_update(self, request, *args, **kwargs):
        user = get_object_or_404(User, id=kwargs['pk'])
        data = request.data
        firebase_data = {}
        if data.get('email', None) is not None:
            firebase_data['email'] = data['email']
        if data.get('phone_number', None) is not None:
            firebase_data['phone_number'] = data['phone_number']
        if data.get('name', None) is not None:
            firebase_data['display_name'] = data['name']
        try:
            auth.update_user(user.username, **firebase_data)
        except (ValueError, exceptions.FirebaseError) as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        return super().partial_update(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == 'partial_update':
            return UserUpdateSerializer
        return UserSerializer
