from django.db import models
from django.conf import settings

# Create your models here.

PHASES = [
    ('SB', 'Submitted'),
    ('PB', 'Published'),
]


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE, null=True)
    question = models.CharField(max_length=50, null=True)
    answer1 = models.CharField(max_length=50, null=True)
    answer2 = models.CharField(max_length=50, null=True)
    phase = models.CharField(max_length=2, choices=PHASES, default='SB')
    likes = models.IntegerField(default=0)
    video = models.FileField(upload_to='posts/', blank=True)

    def __str__(self):
        return self.question[:50]
