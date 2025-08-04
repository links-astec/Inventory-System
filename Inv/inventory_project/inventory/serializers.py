from rest_framework import serializers
from .models import User

class AdminRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        return User.objects.create_user(email=validated_data['email'], password=validated_data['password'], is_admin=True)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class SalespersonAuthSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    token = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    token = serializers.CharField(source='access_token', read_only=True)
    active = serializers.BooleanField(source='is_active')
    
    class Meta:
        model = User
        fields = ['id', 'email', 'role', 'token', 'active']
        
    def get_role(self, obj):
        if obj.is_admin:
            return 'admin'
        elif obj.is_salesperson:
            return 'sales'
        else:
            return 'viewer'
            
    def update(self, instance, validated_data):
        if 'is_active' in validated_data:
            instance.is_active = validated_data['is_active']
        instance.save()
        return instance

class UserCreateSerializer(serializers.ModelSerializer):
    role = serializers.ChoiceField(choices=['admin', 'sales', 'viewer'])
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'password', 'role']
        
    def create(self, validated_data):
        role = validated_data.pop('role')
        email = validated_data['email']
        password = validated_data['password']
        
        is_admin = role == 'admin'
        is_salesperson = role == 'sales'
        
        return User.objects.create_user(
            email=email,
            password=password,
            is_admin=is_admin,
            is_salesperson=is_salesperson
        )

from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'


# inventory/serializers.py

from .models import Customer

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

# inventory/serializers.py

from .models import Sale

class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'


# inventory/serializers.py

from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


# inventory/serializers.py

from .models import AuditLog

class AuditLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditLog
        fields = '__all__'


# inventory/serializers.py

from .models import SystemSettings

class SystemSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemSettings
        fields = '__all__'
