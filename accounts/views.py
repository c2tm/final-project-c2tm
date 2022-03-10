from django.shortcuts import render
from rest_framework import generics, views, authentication, response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .serializers import AccountSerializer
from .models import Account
from .permissions import isUserOnly

# Create your views here.


class AccountListAPIView(generics.ListCreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (IsAdminUser,)

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
    authentication_classes = [authentication.TokenAuthentication]

    def deactivate(self):
        account = Account.objects.get(user=request.user)
        account.active = False
        account.save()
        return response.Response({'message': 'deactivated!'})
