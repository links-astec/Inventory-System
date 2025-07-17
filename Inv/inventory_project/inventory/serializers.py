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


# serializers.py

class TransactionSerializer(serializers.ModelSerializer):
    buyer_name = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()
    date_sold = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')

    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ['user', 'total_price', 'date_sold']

    def get_buyer_name(self, obj):
        return obj.buyer.name if obj.buyer else ""

    def get_product_name(self, obj):
        return obj.product.name if obj.product else ""

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
