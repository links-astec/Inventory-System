from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, is_salesperson=False, is_admin=False):
        if not email:
            raise ValueError("Users must have an email")
        user = self.model(email=self.normalize_email(email), is_salesperson=is_salesperson, is_admin=is_admin)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        return self.create_user(email, password, is_admin=True)


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_salesperson = models.BooleanField(default=False)
    access_token = models.CharField(max_length=100, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_admin

    @property
    def role(self):
        if self.is_admin:
            return 'admin'
        elif self.is_salesperson:
            return 'sales'
        else:
            return 'viewer'

    @property
    def token(self):
        return self.access_token


# inventory/models.py
import uuid
from django.db import models
from django.utils import timezone

class AccessToken(models.Model):
    token = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def mark_used(self):
        self.is_used = True
        self.save()

    def is_valid(self):
        return not self.is_used



from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.IntegerField()
    category = models.CharField(max_length=100)
    best_before = models.DateField()
    sku = models.CharField(max_length=100, unique=True)
    discontinued = models.BooleanField(default=False)
    low_stock_threshold = models.IntegerField(default=10)

    def __str__(self):
        return self.name


# inventory/models.py

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=50)
    address = models.TextField()
    active = models.BooleanField(default=True)
    join_date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name


# inventory/models.py

class Sale(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.user} - {self.product} - {self.amount}"


# inventory/models.py

class Notification(models.Model):
    TYPE_CHOICES = [
        ('info', 'Info'),
        ('warning', 'Warning'),
        ('error', 'Error'),
    ]
    message = models.TextField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.message


# inventory/models.py

class AuditLog(models.Model):
    type = models.CharField(max_length=50)
    user = models.CharField(max_length=100)
    action = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    details = models.TextField(blank=True)

    def __str__(self):
        return f"{self.type} by {self.user}"


# inventory/models.py

class SystemSettings(models.Model):
    currency = models.CharField(max_length=10, default='GH₵')
    currency_code = models.CharField(max_length=10, default='GHS')
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=12.5)

    discount_rules = models.JSONField(default=dict)
    features = models.JSONField(default=dict)
    working_hours = models.JSONField(default=dict)
    notifications = models.JSONField(default=dict)

    def __str__(self):
        return f"System Settings ({self.currency_code})"
