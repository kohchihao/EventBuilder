from rest_framework.permissions import BasePermission


class IsAdminOnly(BasePermission):
    message = 'You do not have permission to do this.'

    def has_permission(self, request, view):
        if request.user.is_authenticated:
            return request.user.is_admin()
        else:
            return False


class IsOwnerOrAdmin(BasePermission):
    message = 'You do not have permission to do this.'

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if hasattr(obj, 'owner'):
            return request.user.is_admin() or request.user.id == obj.owner
        if hasattr(obj, 'username'):
            return request.user.is_admin() or request.user.username == obj.username
