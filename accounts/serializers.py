from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer, TokenSerializer
from rest_auth.models import TokenModel

from .models import Account


class UserDetailsSerializer(UserDetailsSerializer):

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ('is_superuser',)


class TokenSerializer(TokenSerializer):

    is_superuser = serializers.ReadOnlyField(source='user.is_superuser',)

    class Meta(TokenSerializer.Meta):
        model = TokenModel
        fields = TokenSerializer.Meta.fields + ('is_superuser',)


class AccountSerializer(serializers.ModelSerializer):

    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Account
        fields = ('id', 'profile_img', 'user', 'username', 'alias',
                  'bio', 'points', 'alltime_points')
