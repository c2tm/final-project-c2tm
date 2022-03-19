from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer, TokenSerializer
from rest_auth.models import TokenModel

from .models import Account


class AccountSerializer(serializers.ModelSerializer):

    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Account
        fields = ('id', 'profile_img', 'user', 'username', 'alias',
                  'bio', 'points', 'alltime_points', 'active', 'flagged', 'banned')


class UserDetailsSerializer(UserDetailsSerializer):

    account_id = serializers.ReadOnlyField(source='account.id')
    account_points = serializers.ReadOnlyField(source='account.points')
    account_active = serializers.ReadOnlyField(source='account.active')

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + \
            ('is_superuser', 'account_id', 'account_points', 'account_active')


class TokenSerializer(TokenSerializer):

    is_superuser = serializers.ReadOnlyField(source='user.is_superuser',)
    pk = serializers.ReadOnlyField(source='user.id',)
    account_id = serializers.ReadOnlyField(source='user.account.id')
    account_points = serializers.ReadOnlyField(source='user.account.points')
    account_active = serializers.ReadOnlyField(source='user.account.active')

    class Meta(TokenSerializer.Meta):
        model = TokenModel
        fields = TokenSerializer.Meta.fields + \
            ('is_superuser', 'pk', 'account_id',
             'account_points', 'account_active')
