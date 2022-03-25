from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status

from .models import Account
import json


# Create your tests here.

client = Client()


class user_tests(TestCase):

    def test_create_user(self):

        User = get_user_model()
        user = User.objects.create_user(
            username="connor",
            email="connor@example.com",
            password="safepass1",
        )

        self.assertEqual(user.username, 'connor')
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertTrue(user.is_active)


class superuserTests(TestCase):

    def test_create_user(self):

        User = get_user_model()
        user = User.objects.create_superuser(
            username="connor",
            email="connor@example.com",
            password="safepass1",
        )

        self.assertEqual(user.username, 'connor')
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_active)


class accountTests(TestCase):

    def setUp(self):

        User = get_user_model()

        user = User.objects.create_user(
            username="connor",
            email="connor@example.com",
            password="safepass1",
        )

        user2 = User.objects.create_user(
            username="gerald",
            email="gerald@example.com",
            password="safepass1"
        )

        user3 = User.objects.create_user(
            username="robert",
            email="robert@example.com",
            password="safepass1"
        )

        superuser = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='safepass1'
        )

        Account.objects.create(
            user=user3,
            alias='Robert',
            active=True,
            alltime_points=4000,
        )

        Account.objects.create(
            user=user2,
            alias='Gerald',
            active=True,
            points=2000,
        )

        self.assertTrue(client.login(
            username="connor", password="safepass1"))

        self.valid_payload = {
            'alias': user.username,
            'active': True
        }

        self.invalid_payload = {
            'alias': True,
            'active': True,
        }

    def test_create_valid_account(self):
        response = client.post(
            reverse('api:accounts:account-create'),
            data=json.dumps(self.valid_payload),
            content_type='application/json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_account_list(self):
        response = client.get(
            reverse('api:accounts:accounts'),
        )
        # import pdb
        # pdb.set_trace()

        response_dump_data = json.dumps(response.data)
        response_data = json.loads(response_dump_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_data), 2)

    def test_get_specific_account(self):
        '''
        Tests attempting to get a specific account with and without being a superuser
        '''

        response = client.get(
            reverse(f'api:accounts:account-list-detail', kwargs={'pk': 1})
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        client.logout()

        self.assertTrue(client.login(
            username="admin", password="safepass1"))

        response = client.get(
            reverse(f'api:accounts:account-list-detail', kwargs={'pk': 1})
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_account_list_by_points(self):

        response = client.get(
            reverse('api:accounts:accounts-by-points')
        )

        response_dump_data = json.dumps(response.data)
        response_data = json.loads(response_dump_data)

        self.assertTrue(response_data[0]['id'] == 2)

    def test_get_account_list_by_alltime_points(self):

        response = client.get(
            reverse('api:accounts:accounts-by-alltime-points')
        )

        response_dump_data = json.dumps(response.data)
        response_data = json.loads(response_dump_data)

        self.assertTrue(response_data[0]['id'] == 1)
