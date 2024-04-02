from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from myapi.models import Account

@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})

@api_view(['POST'])
def login_view(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        print("username: ", username)
        print("password: ", password)

        get_all_accounts()
        check_credentials(username, password)
        #check_credentials("temple", "temple123")
        user = authenticate(username=username, password=password)
        print("user = ", user)

        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful'})
        else:
            return JsonResponse({'error': 'Invalid username or password'}, status=400)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)



def check_credentials(username, password):
    try:
        # Retrieve the account based on the provided username
        account = Account.objects.get(user_name=username)
        
        # Check if the provided password matches the password stored in the database
        if account.password == password:
            print("Credentials match!")
        else:
            print("Invalid password!")
    except Account.DoesNotExist:
        print("Account does not exist!")

def get_all_accounts():
    # Retrieve all accounts from the database
    all_accounts = Account.objects.all()

    # Iterate over the queryset and print each account's details
    for account in all_accounts:
        # print(f"Account ID: {account.id}")
        # print(f"Email: {account.email}")
        print("-------------------")
        print(f"Username: {account.user_name}")
        print(f"password: {account.password}")
        print("-------------------")