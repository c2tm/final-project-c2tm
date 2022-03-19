from email.policy import default
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
        upload_to='account/', default='account/default-user.png')
    bio = models.TextField(max_length=150, blank=True)
    points = models.IntegerField(default=0)
    alltime_points = models.IntegerField(default=0)
    active = models.BooleanField(default=True)
    flagged = models.BooleanField(default=False)
    banned = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username
