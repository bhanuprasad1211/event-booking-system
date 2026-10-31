from rest_framework.permissions import BasePermission

class IsOrganizer(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'ORGANIZER'

class IsEventOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.organizer == request.user