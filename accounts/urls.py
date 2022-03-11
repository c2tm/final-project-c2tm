from django.urls import path

from accounts.views import AccountListAPIView, UserAccount, UserAccountDetail, DeactivateAccount, ActivateAccount, AccountCreateAPIView


app_name = 'accounts'

urlpatterns = [
    path('', AccountListAPIView.as_view(), name='accounts'),
    path('user/', UserAccount.as_view(), name='accounts-user'),
    path('user/<int:pk>/', UserAccountDetail.as_view(),
         name='accounts-user-detail'),
    path('user/deactivate/', DeactivateAccount.as_view(), name='deactivate'),
    path('user/activate/', ActivateAccount.as_view(), name='activate'),
    path('create/', AccountCreateAPIView.as_view(), name='account-create')
]
