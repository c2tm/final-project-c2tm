from rest_framework import serializers

from .models import Answer, Post


class PostSerialzer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    account_alias = serializers.ReadOnlyField(source='account.alias')

    class Meta:
        model = Post
        fields = ('id', 'user', 'username', 'account', 'question', 'answer1',
                  'answer2', 'phase', 'video', 'thumbnail', 'account_alias', 'likes')


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ('user_answer', 'user', 'post')
