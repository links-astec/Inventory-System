from rest_framework import serializers
from .models import Product, Buyer, Transaction, StockLog, Notification


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


class BuyerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Buyer
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user', 'total_price', 'date_sold']


class StockLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockLog
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
