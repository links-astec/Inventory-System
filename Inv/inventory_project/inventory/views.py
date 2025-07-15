from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

from .models import Product, Buyer, Transaction, Notification
from .serializers import ProductSerializer, BuyerSerializer, TransactionSerializer, NotificationSerializer
from .services import record_transaction


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    phone_number = request.data.get('phone_number')  # Optional: for profile

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    user = User.objects.create_user(username=username, password=password)

    if hasattr(user, 'userprofile'):
        user.userprofile.phone_number = phone_number
        user.userprofile.save()

    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key})


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class TransactionViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
        transactions = Transaction.objects.filter(user=request.user)
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def create(self, request):
        buyer_id = request.data.get('buyer')
        product_id = request.data.get('product')
        quantity_sold = int(request.data.get('quantity_sold'))
        price_per_item = float(request.data.get('price_per_item'))

        try:
            buyer = Buyer.objects.get(id=buyer_id, user=request.user)
            product = Product.objects.get(id=product_id, user=request.user)

            transaction = record_transaction(
                buyer=buyer,
                product=product,
                quantity_sold=quantity_sold,
                price_per_item=price_per_item,
                user=request.user
            )

            serializer = TransactionSerializer(transaction)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class BuyerViewSet(viewsets.ModelViewSet):
    queryset = Buyer.objects.filter(is_active=True)
    serializer_class = BuyerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)
