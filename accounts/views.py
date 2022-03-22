from operator import attrgetter
from django.shortcuts import get_object_or_404, render
from rest_framework import generics, views, authentication, response, filters
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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AccountsByPointListAPIView(generics.ListCreateAPIView):
    serializer_class = AccountSerializer

    def get_queryset(self):
        return Account.objects.order_by('-points')[:10]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AccountsByAllTimePointListAPIView(generics.ListCreateAPIView):
    serializer_class = AccountSerializer

    def get_queryset(self):
        return Account.objects.order_by('-alltime_points')[:10]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AccountListDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (IsAdminUser,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FlaggedAccountListAPIView(generics.ListCreateAPIView):
    queryset = Account.objects.filter(flagged=True)
    serializer_class = AccountSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AccountCreateAPIView(generics.CreateAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def perform_create(self, serializer):
        # import pdb
        # pdb.set_trace()
        serializer.save(user=self.request.user)
        serializer.save(active=True)


class UserAccount(generics.RetrieveAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class UserAccountDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer
    permission_classes = (isUserOnly,)

    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, user=self.request.user)
        return obj

    def perform_create(self, serializer):
        # import pdb
        # pdb.set_trace()
        serializer.save(active=True)


class DeactivateAccount(views.APIView):
    permission_classes = (isUserOnly,)

    def get(self, request):
        account = Account.objects.get(user=request.user.id)
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


@api_view(('POST',))
def AccountByUser(request):
    user_dump_data = json.dumps(request.data)
    user_data = json.loads(user_dump_data)
    user = user_data['user']
    account = Account.objects.get(user=user)
    serializer = AccountSerializer(account)
    return response.Response(serializer.data)


@api_view(('POST',))
def FlagUser(request):
    user_dump_data = json.dumps(request.data)
    user_data = json.loads(user_dump_data)
    user = user_data['user']
    account = Account.objects.get(user=user)
    account.flagged = True
    account.save()
    serializer = AccountSerializer(account)
    return response.Response(serializer.data)


@api_view(('GET',))
def GivePoints(request):
    accounts = Account.objects.all()

    for account in accounts:
        account.points = account.points + 1000
        account.alltime_points = account.alltime_points + 1000
        account.save()

    return response.Response({'message': 'added 1000 points to all accounts!'})
