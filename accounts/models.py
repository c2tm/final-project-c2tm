from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.


class User(AbstractUser):
    pass


class Account(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
    alias = models.CharField(max_length=20, blank=True)
    profile_img = models.ImageField(
        upload_to='account/', default='default-user.png')
    bio = models.TextField(max_length=150, blank=True)
    points = models.IntegerField(blank=True)
    alltime_points = models.IntegerField(blank=True, null=True)
    active = models.BooleanField(default=True)
