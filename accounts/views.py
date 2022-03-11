from django.shortcuts import render
from rest_framework import generics, views, authentication, response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import AccountSerializer
from .models import Account
from .permissions import isUserOnly
import json

# Create your views here.


class AccountListAPIView(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (IsAdminUser,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AccountCreateAPIView(generics.CreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    # permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserAccount(generics.ListAPIView):
    serializer_class = AccountSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user.id
        return Account.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserAccountDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (isUserOnly,)


class DeactivateAccount(views.APIView):
    permission_classes = (isUserOnly,)

    def get(self, request):
        account = Account.objects.get(user=request.user)
        account.active = False
        account.save()
        return response.Response({'message': 'deactivated!'})


class ActivateAccount(views.APIView):
    permission_classes = (isUserOnly,)
    serializer_class = AccountSerializer

    def get(self, request):
        account = Account.objects.get(user=request.user)
        serializer = account
        account.active = True
        account.save()
        serializer = AccountSerializer(account)
        return response.Response(serializer.data)
