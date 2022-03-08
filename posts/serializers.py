from rest_framework import serializers

from .models import Post


class PostSerialzer(serializers.ModelSerializer):
    # add the author's username
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Post
        fields = ('id', 'user', 'username', 'question', 'answer1',
                  'answer2', 'phase', 'likes',)
