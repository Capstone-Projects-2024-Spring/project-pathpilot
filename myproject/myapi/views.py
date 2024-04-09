from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

import logging
import urllib.request
import os
from django.conf import settings
from django.http import HttpResponse

from django.views.generic import View

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})

class FrontendAppView(View):
    """
    Serves the compiled frontend entry point (only works if you have run `yarn
    run build`).
    """
    def get(self, request):
        print (os.path.join(settings.REACT_APP_DIR, 'build', 'index.html'))
        try:
            with open(os.path.join(settings.REACT_APP_DIR, 'build', 'index.html')) as f:
                return HttpResponse(f.read())
        except FileNotFoundError:
            logging.exception('Production build of app not found')
            return HttpResponse(
                status=501,
            )