from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Product
from .models import Notification
from rest_framework.authtoken.models import Token

from .models import Buyer, Transaction
from .services import record_transaction

class ProductAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_product(self):
        url = reverse('product-list')  # DRF auto-names this endpoint
        data = {
            "name": "Test Product",
            "price": 15.50,
            "quantity": 10,
            "available": True,
            "description": "Test product description"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 1)
        self.assertEqual(Product.objects.first().name, "Test Product")



class TransactionTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.product = Product.objects.create(user=self.user, name="Item A", price=10, quantity=50)
        self.buyer = Buyer.objects.create(user=self.user, name="Buyer X")

    def test_record_transaction(self):
        transaction = record_transaction(
            buyer=self.buyer,
            product=self.product,
            quantity_sold=5,
            price_per_item=10,
            user=self.user
        )
        self.assertIsInstance(transaction, Transaction)
        self.assertEqual(transaction.total_price, 50)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 45)  # Stock reduced


class BuyerAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_buyer(self):
        url = '/api/buyers/'
        data = {
            "name": "Test Buyer",
            "contact": "+233000000000"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Buyer.objects.count(), 1)
        self.assertEqual(Buyer.objects.first().name, "Test Buyer")


class TransactionAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.product = Product.objects.create(user=self.user, name="Phone", price=500, quantity=20)
        self.buyer = Buyer.objects.create(user=self.user, name="Chris")

    def test_record_sale_via_api(self):
        url = '/api/transactions/'
        data = {
            "product": self.product.id,
            "buyer": self.buyer.id,
            "quantity_sold": 2,
            "price_per_item": 500
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.product.refresh_from_db()
        self.assertEqual(self.product.quantity, 18)


class NotificationAPITestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        Notification.objects.create(user=self.user, message="Stock low!")

    def test_list_notifications(self):
        url = '/api/notifications/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['message'], "Stock low!")



class AuthAPITestCase(APITestCase):

    def test_signup(self):
        url = '/api/auth/signup/'
        data = {
            "username": "newuser",
            "password": "newpass123",
            "phone_number": "+233123456789"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
        self.assertTrue(User.objects.filter(username="newuser").exists())


    def test_login(self):
        # Create user first
        user = User.objects.create_user(username='loginuser', password='testpass')
        url = '/api/auth/login/'
        data = {
            "username": "loginuser",
            "password": "testpass"
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, 200)
        self.assertIn('token', response.data)
