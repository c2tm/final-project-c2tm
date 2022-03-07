from django.urls import path

from frontend.views import IndexView

app_name = 'frontend'

urlpatterns = [
    path('', IndexView.as_view(), name='frontend'),
]
