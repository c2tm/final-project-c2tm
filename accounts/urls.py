from django.urls import path

from accounts.views import AccountByUser, AccountListAPIView, UserAccount, UserAccountDetail, DeactivateAccount, ActivateAccount, AccountCreateAPIView


app_name = 'accounts'

urlpatterns = [
    path('', AccountListAPIView.as_view(), name='accounts'),
    path('user/', UserAccount.as_view(), name='accounts-user'),
    path('user/detail/', UserAccountDetail.as_view(),
         name='accounts-user-detail'),
    path('user/deactivate/', DeactivateAccount.as_view(), name='deactivate'),
    path('user/activate/', ActivateAccount.as_view(), name='activate'),
    path('user/user-by-id', AccountByUser, name='user-by-id'),
    path('create/', AccountCreateAPIView.as_view(), name='account-create')
]
