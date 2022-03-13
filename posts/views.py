from django.shortcuts import get_object_or_404
from rest_framework import generics, response
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import Answer, Post
from .serializers import AnswerSerializer, PostSerialzer
from .permissions import isUserOnly

# Create your views here.


class PostListApiView(generics.ListAPIView):
    queryset = Post.objects.filter(phase='PB')
    serializer_class = PostSerialzer
    permission_classes = (IsAuthenticated,)


class UserPostListCreateApiView(generics.ListCreateAPIView):
    serializer_class = PostSerialzer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user.id
        return Post.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Saves the user information and sets it to user field
        """
        serializer.save(user=self.request.user)


class UserPostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerialzer
    permission_classes = (isUserOnly,)


class AdminPostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerialzer
    permission_classes = (IsAdminUser,)


class AdminViewDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerialzer
    permission_classes = (IsAdminUser,)


class AnswerListCreateAPIView(generics.ListCreateAPIView):

    serializer_class = AnswerSerializer

    def get_queryset(self):
        user = self.request.user.id
        return Answer.objects.filter(user=user)


def AddLikes(self):
    post = get_object_or_404(self.request.POST.get('id'))
    post.likes.add(self.request.user)
    return response.Response(post.likes)
