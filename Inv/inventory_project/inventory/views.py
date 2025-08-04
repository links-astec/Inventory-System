from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User, AuditLog, SystemSettings
from .serializers import AdminRegisterSerializer, LoginSerializer, SalespersonAuthSerializer, UserSerializer, UserCreateSerializer
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Product,  User  # Adjust paths if different
from .serializers import ProductSerializer
from django.db.models import F
from django.db import transaction
from django.utils import timezone
import json
# inventory/views.py
# inventory/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer

class ProductListCreateView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get(self, request):
        products = Product.objects.all().order_by('-id')
        serializer = ProductSerializer(products, many=True)
        log_audit("VIEW", "User", "Viewed product list", request)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            product = serializer.save()
            log_audit("CREATE", "Admin", f"Created product: {product.name}", request, 
                     f"SKU: {product.sku}, Price: {product.price}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductDetailView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return None

    def get(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product)
        return Response(serializer.data)

    def put(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        product = self.get_object(pk)
        if not product:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AdminRegisterView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []      # No permissions required
    
    def post(self, request):
        serializer = AdminRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminLoginView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []      # No permissions required
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(email=serializer.validated_data['email'], password=serializer.validated_data['password'])
            if user and user.is_admin:
                token, _ = Token.objects.get_or_create(user=user)
                return Response({'token': token.key})
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



from django.contrib.auth import get_user_model
from .serializers import SalespersonAuthSerializer

User = get_user_model()

class SalespersonLoginOrRegisterView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []      # No permissions required
    
    def post(self, request):
        serializer = SalespersonAuthSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        token_value = serializer.validated_data['token']

        # ✅ Step 1: Check if token exists and is valid
        try:
            token_obj = AccessToken.objects.get(token=token_value)
            if token_obj.is_used:
                return Response({'error': 'Token has already been used'}, status=401)
        except AccessToken.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=401)

        # ✅ Step 2: Find or create user
        try:
            user = User.objects.get(email=email)
            if not user.is_salesperson:
                return Response({'error': 'User is not a salesperson'}, status=401)
        except User.DoesNotExist:
            user = User.objects.create_user(
                email=email,
                password=password,
                is_salesperson=True
            )

        # ✅ Step 3: Check password
        if not user.check_password(password):
            return Response({'error': 'Invalid credentials'}, status=401)

        # ✅ Step 4: Mark token as used
        token_obj.mark_used()

        # ✅ Step 5: Issue auth token
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})

# inventory/views.py
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import AccessToken

class GenerateTokenView(APIView):
    authentication_classes = []  # No authentication required
    permission_classes = []      # No permissions required

    def post(self, request):
        token = str(uuid.uuid4())[:8]  # short readable token
        access_token = AccessToken.objects.create(token=token)
        return Response({'token': token}, status=status.HTTP_201_CREATED)


# inventory/views.py

from .models import Customer
from .serializers import CustomerSerializer

class CustomerListCreateView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get(self, request):
        customers = Customer.objects.all().order_by('-join_date')
        serializer = CustomerSerializer(customers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomerDetailView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get_object(self, pk):
        try:
            return Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            return None

    def get(self, request, pk):
        customer = self.get_object(pk)
        if not customer:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def put(self, request, pk):
        customer = self.get_object(pk)
        if not customer:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        customer = self.get_object(pk)
        if not customer:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# inventory/views.py

from .models import Sale
from .serializers import SaleSerializer

class SaleListCreateView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get(self, request):
        sales = Sale.objects.all().order_by('-date')
        serializer = SaleSerializer(sales, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SaleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# inventory/views.py

from django.db.models import Sum, Count, Q
from .models import Product, Sale, Customer, User

class DashboardStatsView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get(self, request):
        total_items = Product.objects.aggregate(total=Count('id'))['total']
        total_sales = Sale.objects.aggregate(total=Count('id'))['total']
        total_revenue = Sale.objects.aggregate(total=Sum('amount'))['total'] or 0
        active_sales_personnel = User.objects.filter(is_salesperson=True, is_active=True).count()

        low_stock_items = Product.objects.filter(quantity__lte=F('low_stock_threshold')).values(
            'id', 'name', 'quantity', 'sku'
        )

        return Response({
            "totalItems": total_items,
            "totalSales": total_sales,
            "totalRevenue": total_revenue,
            "activeSalesPersonnel": active_sales_personnel,
            "lowStockItems": list(low_stock_items)
        })


# inventory/views.py

from .models import AuditLog
from .serializers import AuditLogSerializer

class AuditLogListView(APIView):
    def get(self, request):
        logs = AuditLog.objects.order_by('-timestamp')[:50]
        serializer = AuditLogSerializer(logs, many=True)
        return Response(serializer.data)

from .models import Notification
from .serializers import NotificationSerializer

class NotificationListCreateView(APIView):
    def get(self, request):
        notifications = Notification.objects.order_by('-created_at')[:20]
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# inventory/views.py

from .models import SystemSettings
from .serializers import SystemSettingsSerializer

class SystemSettingsView(APIView):
    def get(self, request):
        settings = SystemSettings.objects.first()
        if not settings:
            return Response({"detail": "Settings not found"}, status=404)
        serializer = SystemSettingsSerializer(settings)
        return Response(serializer.data)

    def put(self, request):
        settings = SystemSettings.objects.first()
        if not settings:
            return Response({"detail": "Settings not found"}, status=404)
        serializer = SystemSettingsSerializer(settings, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)



'''@api_view(['GET'])
def dashboard_stats(request):
    products = Product.objects.all()
    sales = Sale.objects.all()
    users = User.objects.filter(is_salesperson=True, is_active=True)

    low_stock_items = products.filter(quantity__lt=models.F('low_stock_threshold'))

    data = {
        'totalItems': products.count(),
        'totalSales': sales.count(),
        'totalRevenue': sum(s.amount for s in sales),
        'activeSalesPersonnel': users.count(),
        'lowStockItems': ProductSerializer(low_stock_items, many=True).data
    }
    return Response(data)
'''

# User Management Views
class UserListCreateView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get(self, request):
        users = User.objects.all().exclude(is_superuser=True).order_by('-id')
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDetailView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            return None
    
    def get(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    def put(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Handle role changes
        if 'role' in request.data:
            role = request.data['role']
            user.is_admin = role == 'admin'
            user.is_salesperson = role == 'sales'
            user.save()
        
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        user = self.get_object(pk)
        if not user:
            return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

def log_audit(action_type, user_email, action, request, details=""):
    """Helper function to log audit events"""
    try:
        ip_address = request.META.get('REMOTE_ADDR', '127.0.0.1')
        AuditLog.objects.create(
            type=action_type,
            user=user_email or "System",
            action=action,
            ip_address=ip_address,
            details=details,
            timestamp=timezone.now()
        )
    except Exception as e:
        print(f"Audit logging failed: {e}")

class AuditLogView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get(self, request):
        """Get all audit logs"""
        logs = AuditLog.objects.all().order_by('-timestamp')[:100]  # Latest 100
        audit_data = []
        for log in logs:
            audit_data.append({
                'id': log.id,
                'type': log.type,
                'user': log.user,
                'action': log.action,
                'timestamp': log.timestamp.isoformat(),
                'ip_address': log.ip_address,
                'details': log.details
            })
        return Response(audit_data, status=status.HTTP_200_OK)

class SystemSettingsView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def get(self, request):
        """Get system settings"""
        try:
            settings = SystemSettings.objects.first()
            if not settings:
                # Create default settings
                settings = SystemSettings.objects.create()
            
            return Response({
                'currency': settings.currency,
                'currency_code': settings.currency_code,
                'tax_rate': float(settings.tax_rate),
                'discount_rules': settings.discount_rules,
                'features': settings.features,
                'working_hours': settings.working_hours,
                'notifications': settings.notifications
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def put(self, request):
        """Update system settings"""
        try:
            settings = SystemSettings.objects.first()
            if not settings:
                settings = SystemSettings.objects.create()
            
            # Update settings
            if 'currency' in request.data:
                settings.currency = request.data['currency']
            if 'currency_code' in request.data:
                settings.currency_code = request.data['currency_code']
            if 'tax_rate' in request.data:
                settings.tax_rate = request.data['tax_rate']
            if 'discount_rules' in request.data:
                settings.discount_rules = request.data['discount_rules']
            if 'features' in request.data:
                settings.features = request.data['features']
            if 'working_hours' in request.data:
                settings.working_hours = request.data['working_hours']
            if 'notifications' in request.data:
                settings.notifications = request.data['notifications']
            
            settings.save()
            
            # Log the change
            log_audit("SETTINGS", "Admin", f"Updated system settings", request, 
                     json.dumps(request.data))
            
            return Response({'message': 'Settings updated successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GenerateUserTokenView(APIView):
    authentication_classes = []  # No authentication required for now
    permission_classes = []      # No permissions required for now
    
    def post(self, request):
        user_id = request.data.get('user_id')
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(pk=user_id)
            if not user.is_salesperson:
                return Response({'error': 'User must be a salesperson'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Generate a new token
            import random
            import string
            token = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
            user.access_token = token
            user.save()
            
            # Log token generation
            log_audit("TOKEN", "Admin", f"Generated token for user {user.email}", request, f"Token: {token}")
            
            return Response({'token': token}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)