
from django.db import models

# Create your models here.
# Make sure to run 'python manage.py makemigrations' and 'python manage.py migrate' after making any changes to these models.

class Account(models.Model):
    user_name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)

class LocationType(models.Model):
    location_type = models.CharField(max_length=255, unique=True)

class Location(models.Model):
    location_type = models.ForeignKey(LocationType, on_delete=models.CASCADE)
    location_name = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=10)
    latitude = models.FloatField()
    longitude = models.FloatField()
    street_address = models.CharField(max_length=255)
    hours_of_op = models.CharField(max_length=255, null=True)
    average_star_rating = models.FloatField(null=True)

class SavedRoute(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    zip_code = models.CharField(max_length=10)

class SavedRouteLocation(models.Model):
    route = models.ForeignKey(SavedRoute, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    location_order = models.IntegerField()


