from rest_framework import serializers

from .models import Answer, Post


class AnswerSerializer(serializers.ModelSerializer):
    user_points = serializers.ReadOnlyField(source='profile.points')
    user_alltime_points = serializers.ReadOnlyField(
        source='profile.alltime_points')

    class Meta:
        model = Answer
        fields = ('user_answer', 'profile', 'post',
                  'user_points', 'points_wagered', 'user', 'user_alltime_points',)


class PostSerialzer(serializers.ModelSerializer):
    answers = AnswerSerializer(read_only=True, many=True)
    username = serializers.ReadOnlyField(source='user.username')
    account_alias = serializers.ReadOnlyField(source='account.alias')
    account_active = serializers.ReadOnlyField(source='account.active')

    class Meta:
        model = Post
        fields = ('id', 'user', 'username', 'account', 'question', 'answer1',
                  'answer2', 'phase', 'video', 'thumbnail', 'account_alias', 'likes', 'correct_answer', 'answers', 'account_active',)
