from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import authenticate, login

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})

@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        print("here")
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
