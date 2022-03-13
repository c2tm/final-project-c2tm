from django.db import models
from django.conf import settings

from accounts.models import Account

# Create your models here.

PHASES = [
    ('SB', 'Submitted'),
    ('PB', 'Published'),
]

ANSWERS = [
    ('1', 'Answer_1'),
    ('2', 'Answer_2'),
]


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, null=True)
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, null=True)
    question = models.CharField(max_length=50, null=True)
    answer1 = models.CharField(max_length=50, null=True)
    answer2 = models.CharField(max_length=50, null=True)
    correct_answer = models.CharField(
        max_length=1, choices=ANSWERS, default='1')
    phase = models.CharField(max_length=2, choices=PHASES, default='SB')
    video = models.FileField(upload_to='posts/', blank=True)
    thumbnail = models.ImageField(
        upload_to='posts/thumbnails/', default='posts/thumbnails/real14.jpg')
    likes = models.ManyToManyField(
        Account, related_name='post_likes', blank=True)

    def __str__(self):
        return self.question[:50]


class Answer(models.Model):
    user_answer = models.CharField(max_length=1, choices=ANSWERS)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, null=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.user.username
