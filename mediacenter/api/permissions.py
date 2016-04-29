from rest_framework import permissions


class IsAuthenticated(permissions.BasePermission):
    message = "permissions not allowed"

    def has_permission(self, request, view):
        return request.session.get('logged_in', False)
