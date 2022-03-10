from django.urls import path

from accounts.views import AccountListAPIView, UserAccount, UserAccountDetail,  DeactivateAccount


app_name = 'accounts'

urlpatterns = [
    path('', AccountListAPIView.as_view(), name='accounts'),
    path('user/', UserAccount.as_view(), name='accounts-user'),
    path('user/<int:pk>/', UserAccountDetail.as_view(),
         name='accounts-user-detail'),
    path('user/deactivate/', DeactivateAccount.as_view(), name='deactivate'),
]
