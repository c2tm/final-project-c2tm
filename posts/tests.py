import tempfile
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

from accounts.models import Account
import json

from posts.models import Post


# Create your tests here.

client = Client()


class posts_tests(TestCase):

    def setUp(self):

        User = get_user_model()

        user = User.objects.create_user(
            username="connor",
            email="connor@example.com",
            password="safepass1",
        )

        user2 = User.objects.create_user(
            username="robert",
            email="robert@example.com",
            password="safepass1",
        )

        user3 = User.objects.create_user(
            username="chris",
            email="chris@example.com",
            password="safepass1",
        )

        account = Account.objects.create(
            user=user,
            alias='Connor',
            active=True,
            points=2000,
            alltime_points=4000,
        )

        account2 = Account.objects.create(
            user=user2,
            alias='Robert',
            active=True,
            points=2000,
            alltime_points=4000,
        )

        account3 = Account.objects.create(
            user=user3,
            alias='Chris',
            active=True,
            points=2000,
            alltime_points=4000,
        )

        post = Post.objects.create(
            question='Mock Question A',
            answer1='Mock Answer 1',
            answer2='Mock Answer 2',
            correct_answer='answer1',
            user=user3,
            account=account3,
            phase='SB',
            video=tempfile.NamedTemporaryFile(suffix='.mp4').name
        )

        self.assertTrue(client.login(
            username="connor", password="safepass1"))

        self.valid_payload = {
            'question': 'Mock Question',
            'answer1': 'Mock Answer 1',
            'answer2': 'Mock Answer 2',
            'correct_answer': 'answer1',
            'user': user.id,
            'account': account.id,
            'phase': 'SB',
            'video': tempfile.NamedTemporaryFile(suffix='.mp4').name
        }

        self.invalid_payload = {
            'question': True,
            'answer1': True,
            'answer2': 'Mock Answer 2',
            'correct_answer': 'answer1',
            'user': user.id,
            'account': account.id,
            'phase': 'SB',
            'video': True,
        }

        self.valid_payload2 = {
            'post': post.id,
            'user_answer': 'answer1',
            'profile': account.id,
            'user': user.id,
            'points_wagered': 200,
        }

        self.invalid_payload2 = {
            'post': 34,
            'user_answer': True,
            'profile': account,
            'user': user,
            'points_wagered': 200,
        }

        Post.objects.create(
            question='Mock Question 2',
            answer1='Mock Answer 1',
            answer2='Mock Answer 2',
            correct_answer='answer1',
            user=user,
            account=account,
            phase='SB',
            video=tempfile.NamedTemporaryFile(suffix='.mp4').name
        )

        Post.objects.create(
            question='Mock Question 3',
            answer1='Mock Answer 1',
            answer2='Mock Answer 2',
            correct_answer='answer1',
            user=user2,
            account=account2,
            phase='SB',
            video=tempfile.NamedTemporaryFile(suffix='.mp4').name
        )

    def test_create_post(self):

        response = client.post(
            reverse('api:posts:user_posts'),
            data=json.dumps(self.valid_payload),
            content_type='application/json',
        )

        self.assertTrue(response.status_code, status.HTTP_201_CREATED)

        response = client.post(
            reverse('api:posts:user_posts'),
            data=json.dumps(self.invalid_payload),
            content_type='application/json',
        )

        self.assertTrue(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_post_detail_permissions(self):

        response = client.get(
            reverse('api:posts:user_post_detail', kwargs={'pk': 1}),
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        response2 = client.get(
            reverse('api:posts:user_post_detail', kwargs={'pk': 2}),
        )

        self.assertEqual(response2.status_code, status.HTTP_200_OK)

    def test_create_answer(self):

        response = client.post(
            reverse('api:posts:user_answer_list'),
            data=json.dumps(self.valid_payload2),
            content_type='application/json',
        )

        self.assertTrue(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['user_points'], 2200)
