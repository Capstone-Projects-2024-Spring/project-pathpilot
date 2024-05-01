from django.urls import path
from . import views

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('login/', views.user_login_attempt, name ='login'),
    path('signup/', views.user_create_account, name='create_account'),
    path('calculateRoute/', views.calculate_route, name='calculate_route'),
    path('addSavedRoute/', views.add_saved_route, name='add_saved_route'),
    path('getSavedRoutes/', views.get_saved_routes, name='get_saved_routes'),
    path('getUsername/', views.get_username, name='get_username'),
    path('useAIFunctionality/', views.get_AI_suggestion, name='get_AI_suggestion')
]