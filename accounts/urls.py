from django.urls import path

from accounts.views import AccountListAPIView


app_name = 'accounts'

urlpatterns = [
    path('', AccountListAPIView.as_view(), name='accounts')
]
