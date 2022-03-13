from django.urls import path
from posts.views import AddLikes, PostListApiView, UserPostListCreateApiView, UserPostDetail, AdminPostListView, AdminViewDetail, AnswerListCreateAPIView


app_name = 'posts'

urlpatterns = [
    path('', PostListApiView.as_view(), name='published_posts'),
    path('user/', UserPostListCreateApiView.as_view(), name='user_posts'),
    path('user/<int:pk>/', UserPostDetail.as_view(), name='user_post_detail'),
    path('admin/', AdminPostListView.as_view(), name='admin_view'),
    path('admin/<int:pk>/', AdminViewDetail.as_view(), name='admin_view_detail'),
    path('like/', AddLikes, name='add_likes'),
    path('user/answers/', AnswerListCreateAPIView.as_view(), name='user_answer_list')
]
