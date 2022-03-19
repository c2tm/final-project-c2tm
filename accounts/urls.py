from django.urls import path

from accounts.views import AccountByUser, FlagUser, AccountListDetail, AccountListAPIView, FlaggedAccountListAPIView, UserAccount, UserAccountDetail, DeactivateAccount, ActivateAccount, AccountCreateAPIView


app_name = 'accounts'

urlpatterns = [
    path('', AccountListAPIView.as_view(), name='accounts'),
    path('flagged/', FlaggedAccountListAPIView.as_view(),
         name='flagged-accounts-list'),
    path('user/', UserAccount.as_view(), name='accounts-user'),
    path('user/detail/', UserAccountDetail.as_view(),
         name='accounts-user-detail'),
    path('<int:pk>/', AccountListDetail.as_view(),
         name='account-list-detail'),
    path('user/deactivate/', DeactivateAccount.as_view(), name='deactivate'),
    path('user/activate/', ActivateAccount.as_view(), name='activate'),
    path('user/user-by-id', AccountByUser, name='user-by-id'),
    path('create/', AccountCreateAPIView.as_view(), name='account-create'),
    path('flag/', FlagUser, name='flag-user')
]
