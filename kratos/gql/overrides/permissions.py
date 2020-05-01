from rest_framework import viewsets
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

'''
Mixed permission base model allowing for action level
permission control. Subclasses may define their permissions
by creating a 'permission_classes_by_action' variable.

Example:
permission_classes_by_action = {'list': [AllowAny],
                                'create': [IsAdminUser]}
'''


class MixedPermissionViewSet(viewsets.ViewSet):
    permission_classes_by_action = {}

    def get_permissions(self):
        try:
            # return permission_classes depending on `action`
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]


class MixedPermissionModelViewSet(viewsets.ModelViewSet):
    permission_classes_by_action = {}

    def get_permissions(self):
        try:
            # return permission_classes depending on `action`
            return [permission() for permission in self.permission_classes_by_action[self.action]]
        except KeyError:
            # action is not set return default permission_classes
            return [permission() for permission in self.permission_classes]

    @staticmethod
    def create_with_two_serializers(request, writable_serializer, response_serializer):
        serializer = writable_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.create(validated_data=serializer.validated_data)
        return Response(response_serializer(instance, context={"request": request}).data)

    @staticmethod
    def update_with_two_serializers(request, pk, model, writable_serializer, response_serializer):
        serializer = writable_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        existing_instance = get_object_or_404(model, id=pk)
        updated_instance = serializer.update(instance=existing_instance, validated_data=serializer.validated_data)
        return Response(response_serializer(updated_instance, context={"request": request}).data)
