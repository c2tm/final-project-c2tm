import json
import pdb
from django.shortcuts import get_object_or_404
from rest_framework import generics, response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import api_view

from accounts.models import Account
from .models import Answer, Post
from .serializers import AnswerSerializer, PostSerialzer
from .permissions import isUserOnly

# Create your views here.


class AllPostsListApiView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerialzer
    permission_classes = (IsAdminUser,)


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
    queryset = Post.objects.filter(phase='SB')
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

    def perform_create(self, serializer):
        """
        Saves the user information and sets it to user field
        """

        answer_dump_data = json.dumps(self.request.data)
        answer_data = json.loads(answer_dump_data)

        points = answer_data['points_wagered']
        answer_user = self.request.user
        answer_post = answer_data['post']
        answer_guessed = answer_data['user_answer']
        post = Post.objects.get(id=answer_post)
        user_account = Account.objects.get(user=answer_user)

        correct_answer = post.correct_answer

        print(points)
        print(user_account.points)

        if answer_guessed == correct_answer:
            user_account.points = user_account.points + points
            user_account.alltime_points = user_account.alltime_points + points
        else:
            user_account.points = user_account.points - points

        print(user_account.points)

        user_account.save()

        serializer.save(user=answer_user)


@ api_view(('POST',))
def LikeAndUnlikeView(request):
    dump_data = json.dumps(request.data)
    data = json.loads(dump_data)
    post = get_object_or_404(Post, id=data['post_id'])
    check_if_liked = filter(lambda x: x == request.user, post.likes.all())
    liked_list = list(check_if_liked)
    if(len(liked_list) > 0):
        post.likes.remove(request.user)
        return response.Response({'message': 'Unliked!'})
    else:
        post.likes.add(request.user)
        return response.Response({'message': 'Liked!'})


@ api_view(('POST',))
def PostListByUserView(request):
    post_dump_data = json.dumps(request.data)
    post_data = json.loads(post_dump_data)
    user = post_data['user']
    post_list = Post.objects.filter(user=user)
    return response.Response(post_list)
