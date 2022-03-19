from django.db import models
from django.conf import settings

from accounts.models import Account, User

# Create your models here.

PHASES = [
    ('SB', 'Submitted'),
    ('PB', 'Published'),
    ('RJ', 'Rejected'),
]

ANSWERS = [
    ('answer1', 'Answer_1'),
    ('answer2', 'Answer_2'),
]


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, null=True)
    account = models.ForeignKey(
        Account, on_delete=models.CASCADE, related_name='post_account', null=True)
    question = models.CharField(max_length=50, null=True)
    answer1 = models.CharField(max_length=50, null=True)
    answer2 = models.CharField(max_length=50, null=True)
    correct_answer = models.CharField(
        max_length=7, choices=ANSWERS, default='answer1')
    phase = models.CharField(max_length=2, choices=PHASES, default='SB')
    video = models.FileField(upload_to='posts/', blank=True)
    thumbnail = models.ImageField(
        upload_to='posts/thumbnails/', default='posts/thumbnails/real14.jpg')
    likes = models.ManyToManyField(
        User, related_name='post_likes', blank=True)

    def __str__(self):
        return self.question[:50]


class Answer(models.Model):
    post = models.ForeignKey(
        Post, on_delete=models.CASCADE, null=True, related_name="answers")
    user_answer = models.CharField(max_length=7, choices=ANSWERS)
    profile = models.ForeignKey(Account,
                                on_delete=models.CASCADE, null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, null=True)
    points_wagered = models.IntegerField()
