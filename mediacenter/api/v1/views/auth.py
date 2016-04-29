# -*- coding: utf-8 -*-
import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from ..serializers.auth import LoginSerializer


class LoginAPIView(APIView):
    """ login api view """
    permission_classes = ()

    def post(self, request):
        """ sign in api """
        serializer = LoginSerializer(data={
            'login': request.POST.get('login'),
            'password': request.POST.get('password'),
        })
        if serializer.is_valid():
            request.session['logged_in'] = True
            return Response({})

        return Response({
            "errors": serializer.errors
        })

@api_view(['DELETE'])
def logout(request):
    del request.session["logged_in"]
    return Response({})