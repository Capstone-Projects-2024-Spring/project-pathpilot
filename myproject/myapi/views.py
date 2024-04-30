from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from myapi.PathController import PathController
from myapi.SavedRoutesController import SavedRoutesController
from myapi.models import Account
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})

@api_view(['POST'])
def user_login_attempt(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful', 'user': username, 'id': user.id})
        else:
            return JsonResponse({'message': 'error: Invalid username or password'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@api_view(['POST'])
def user_create_account(request):
    if request.method == 'POST':
        # Retrieve data from the request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if username or email already exists
        if User.objects.filter(username=username).exists():
            return JsonResponse({'message': 'error: Username already exists'})
        if User.objects.filter(email=email).exists():
            return JsonResponse({'message': 'error: Email already exists'})
        
        # Create the user account
        user = User.objects.create_user(username=username, email=email, password=password)
        return JsonResponse({'message': 'User account created successfully'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['POST'])
def calculate_route(request):
    if request.method == 'POST':
        location_types = request.data.get('locationTypes')
        attributes = request.data.get('attributesToSend')
        neighborhood = request.data.get('neighborhood')
        transitType = request.data.get('locatedNear')
        crawlSize = request.data.get('crawlChoice')

        #crawl version, must be before transit is added
        if(crawlSize!= None):
            print("made it in here")
            i=0
            choice = location_types[0]
            while (i<crawlSize-1):
                i+=1
                location_types.append(choice) #repeat it on list
                
        
        #accomodate for chosen transit method
        if(transitType!=None): #put it in there!
            if(transitType==11): #parking garage, add to beginning
                location_types.insert(0, transitType)
            if(transitType==13 or transitType == 15): #13 = subways; 14 = regional rail
                location_types.insert(0, transitType) #add to the beginning
                location_types.append(transitType) #add to the end, not guaranteed or neccessary to be the same station, just one close
            

        path_controller = PathController()
        route = path_controller.calculateReasonableRoute(location_types, attributes, neighborhood, transitType)
        print("did it get to here")
        if route:
            # only calculate polyline if no error (route is not None)
            polyline = path_controller.calculatePolyline(route)

            return JsonResponse({'route': route, 'polyline': polyline})
        else:
            # Handle the case where no route could be calculated
            return JsonResponse({'error': 'Failed to calculate route'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@api_view(['GET'])
def get_saved_routes(request):
    if request.method == 'GET':
        saved_routes_controller = SavedRoutesController()
        id = request.GET.get('id')
        routes_ids = saved_routes_controller.getSavedRoutes(id)
        routes_info = saved_routes_controller.getLocationInfo(routes_ids)        

        return JsonResponse({'routes': routes_info})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
 
@api_view(['POST'])
def add_saved_route(request):
    if request.method == 'POST':
        user_id = request.data.get("user_id")
        locations = request.data.get("locations")
        saved_routes_controller = SavedRoutesController()
        saved_routes_controller.addSavedRoute(user_id, locations)
        return JsonResponse({'message': 'we out here'})
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)

@api_view(['GET'])
def get_username(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            username = request.session.get('username')
            return JsonResponse({'username': username})
        else:
            return JsonResponse({'error': 'User is not authenticated'}, status=401)
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
        print(f"Account ID: {account.id}")
        print(f"Email: {account.email}")
        print(f"Username: {account.user_name}")
        print(f"password: {account.password}")
