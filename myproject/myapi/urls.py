from django.urls import path, re_path
from . import views
from myapi.views import FrontendAppView

urlpatterns = [
    path('hello-world/', views.hello_world, name='hello_world'),
    re_path(r'^', FrontendAppView.as_view())
]