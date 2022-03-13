from django.contrib import admin

from .models import Answer, Post
# Register your models here.

admin.site.register(Post)
admin.site.register(Answer)
