from django.urls import path
from . import views

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    path('login/', views.user_login_attempt, name ='login'),
    path('signup/', views.user_create_account, name='create_account')
]